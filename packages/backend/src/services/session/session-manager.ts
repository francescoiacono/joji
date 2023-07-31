import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session';
import { SessionConfig } from '@joji/config';
import { EventEmitter } from '../event-emitter';
import { UserManager } from '../user/user-manager';

interface SessionManagerOptions {
  userManager: UserManager;
}

export type SessionManagerEvents = {
  sessionIdle: (data: { session: Session }) => void;
  sessionActive: (data: { session: Session }) => void;
  sessionCreated: (data: { session: Session }) => void;
  sessionDeleted: (data: { session: Session }) => void;
};

export class SessionManager {
  public events: EventEmitter<SessionManagerEvents>;
  private sessions: Map<Session['id'], Session>;
  private disconnectTimeouts: Map<Session['id'], NodeJS.Timeout> = new Map();
  private userManager: UserManager;

  constructor(options: SessionManagerOptions) {
    this.events = new EventEmitter<SessionManagerEvents>();
    this.sessions = new Map();
    this.userManager = options.userManager;
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
   * Sets a timeout to delete the session if the client does not reconnect
   * within the given timeout
   */
  public setDisconnectTimeout(session: Session): void {
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
    const user = this.userManager.createGuestUser(socket.id);
    const session = new Session({ id, socketId: socket.id, user });

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
