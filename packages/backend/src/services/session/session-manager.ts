import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session';

export class SessionManager {
  private sessions: Map<Session['id'], Session>;

  constructor() {
    this.sessions = new Map();
  }

  /**
   * Returns the existing session for the given socket.
   * If the socket does not have a session, a new one is created
   */
  public getSession(socket: Socket): Session {
    const existingSessionId = this.getSessionIdFromSocket(socket);

    if (existingSessionId) {
      const existingSession = this.sessions.get(existingSessionId);
      if (existingSession) {
        return existingSession;
      }
    }

    return this.createSession(socket);
  }

  /**
   * Deletes the session for the given socket
   */
  public deleteSession(socket: Socket): void {
    const sessionId = this.getSessionIdFromSocket(socket);
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }

  /**
   * Creates a new session for the given socket
   * and returns the session
   */
  private createSession(socket: Socket): Session {
    const id = this.generateSessionId();
    const session = new Session({ id, socketId: socket.id });

    this.sessions.set(id, session);
    socket.handshake.auth.sessionId = id;

    return session;
  }

  /**
   * Returns the session ID associated with the given socket.
   * If the socket does not have a session ID, a new one is generated
   * and assigned to the socket
   */
  private getSessionId(socket: Socket): string {
    let sessionId = this.getSessionIdFromSocket(socket);
    if (!sessionId) {
      sessionId = this.generateSessionId();
      socket.handshake.auth.sessionId = sessionId;
    }

    return sessionId;
  }

  /**
   * Returns the session ID associated with the given socket.
   */
  public getSessionIdFromSocket(socket: Socket): string | undefined {
    return socket.handshake.auth.sessionId;
  }

  /**
   * Generates a random session ID
   */
  private generateSessionId(): string {
    return uuidv4();
  }
}
