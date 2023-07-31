import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session';
import { SessionConfig } from '@joji/config';
import { EventEmitter } from '../event-emitter';
import { UserService } from '../user/user-manager';

interface SessionServiceOptions {
  userService: UserService;
}

export type SessionServiceEvents = {
  sessionIdle: (data: { session: Session }) => void;
  sessionActive: (data: { session: Session }) => void;
  sessionCreated: (data: { session: Session }) => void;
  sessionDeleted: (data: { session: Session }) => void;
};

export class SessionService {
  public events: EventEmitter<SessionServiceEvents>;
  private sessions: Map<Session['id'], Session>;
  private disconnectTimeouts: Map<Session['id'], NodeJS.Timeout> = new Map();
  private userService: UserService;

  constructor(options: SessionServiceOptions) {
    this.events = new EventEmitter<SessionServiceEvents>();
    this.sessions = new Map();
    this.userService = options.userService;
  }

  /**
   * Returns the existing session for the given socket.
   * If the socket does not have a session, a new one is created
   */
  public getSessionBySocket(socket: Socket): Session {
    const existingSessionId = this.getSocketSessionId(socket);

    if (existingSessionId) {
      const existingSession = this.sessions.get(existingSessionId);

      if (existingSession) {
        existingSession.addSocketId(socket.id);

        return existingSession;
      }
    }

    return this.createSession(socket);
  }

  /**
   * Returns the socket associated with the given session ID
   */
  public getSessionById(sessionId: Session['id']): Session | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Returns all sessions associated with the given user ID
   */
  public getSessionsByUserId(userId: Session['user']['id']): Session[] {
    return Array.from(this.sessions.values()).filter(
      session => session.user.id === userId
    );
  }

  /**
   * Called when a socket disconnects
   */
  public onSocketDisconnect(socket: Socket): void {
    // Get the session ID from the socket
    const sessionId = this.getSocketSessionId(socket);
    if (!sessionId) {
      return;
    }

    // If the session does not exist, return
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    // Remove the socket ID from the session
    session.removeSocketId(socket.id);

    // Start the disconnect timeout if the session is empty
    if (session.socketIds.length === 0) {
      this.setDisconnectTimeout(session);
    }
  }

  /**
   * Sets a timeout to delete the session if the client does not reconnect
   * within the given timeout
   */
  private setDisconnectTimeout(session: Session): void {
    // Create a timeout to delete the session
    const timeout = setTimeout(() => {
      this.deleteSession(session);
      this.clearDisconnectTimeout(session);
    }, SessionConfig.idleTimeout);

    // Store the timeout
    this.disconnectTimeouts.set(session.id, timeout);

    // Emit the `sessionIdle` event
    this.events.emit('sessionIdle', { session });
  }

  /**
   * Clears a disconnect timeout
   */
  public clearDisconnectTimeout(session: Session): void {
    const timeout = this.disconnectTimeouts.get(session.id);

    // If there is no timeout, return
    if (!timeout) {
      return;
    }

    // Clear the timeout and delete it from the map
    clearTimeout(timeout);
    this.disconnectTimeouts.delete(session.id);

    // Emit the `sessionActive` event
    this.events.emit('sessionActive', { session });
  }

  /**
   * Creates a new session for the given socket
   * and returns the session
   */
  private createSession(socket: Socket): Session {
    const id = this.generateSessionId(socket);
    const user = this.userService.createGuestUser();
    const session = new Session({ id, socketIds: new Set([socket.id]), user });

    // Assign the session
    this.sessions.set(id, session);
    socket.handshake.auth.sessionId = id;

    // Emit the `sessionCreated` event
    this.events.emit('sessionCreated', { session });

    // Return the session
    return session;
  }

  /**
   * Returns the session ID associated with the given socket.
   */
  private getSocketSessionId(socket: Socket): string | undefined {
    // If we're in development, allow the client to specify a session ID
    if (process.env.NODE_ENV === 'development') {
      return socket.handshake.headers.session as string;
    }

    return socket.handshake.auth.sessionId;
  }

  /**
   * Generates a random session ID
   */
  private generateSessionId(socket: Socket): string {
    // If we're in development, allow the client to specify a session ID
    if (process.env.NODE_ENV === 'development') {
      return (socket.handshake.headers.session as string) || uuidv4();
    }

    return uuidv4();
  }

  /**
   * Deletes the session for the given socket
   */
  private deleteSession(session: Session): void {
    // If there is no session id, return
    if (!session) {
      return;
    }

    // Delete the session
    this.sessions.delete(session.id);

    // Emit the `sessionDeleted` event
    this.events.emit('sessionDeleted', { session });
  }
}
