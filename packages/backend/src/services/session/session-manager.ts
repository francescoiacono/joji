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
   * Deletes the session for the given socket
   */
  public deleteSession(socket: Socket): void {
    const sessionId = this.getSocketSessionId(socket);
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }

  /**
   * Creates a new session for the given socket
   * and returns the session
   */
  private createSession(socket: Socket): Session {
    const id = this.generateSessionId(socket);
    const session = new Session({ id, socketId: socket.id });

    this.sessions.set(id, session);
    socket.handshake.auth.sessionId = id;

    return session;
  }

  /**
   * Returns the session ID associated with the given socket.
   */
  private getSocketSessionId(socket: Socket): string | undefined {
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
}
