import { RoomManager, SessionManager } from '@/services';
import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';
import { SocketEvent } from '@joji/types';
import { listeners } from '@/listeners';

interface ServerStartOptions {
  port?: number;
}

export class Server {
  public sessionManager: SessionManager;
  public roomManager: RoomManager;
  public io: IOServer;

  constructor() {
    this.io = this.createIOServer();
    this.sessionManager = this.createSessionManager();
    this.roomManager = this.createRoomManager();
  }

  /**
   * Start the Socket.IO server
   */
  public start(options: ServerStartOptions = {}): void {
    // Start the server
    const port = Number(process.env.PORT) || options.port || 8000;
    this.io.listen(port);

    // Log the server start event
    logger.info(`🚀 Server listening on port ${port}`);

    // Listen for new connections
    this.io.on('connection', socket => {
      logger.debug('A user connected', { socketId: socket.id });

      // Get the session and send it to the client
      const session = this.sessionManager.getSessionBySocket(socket);
      socket.emit(SocketEvent.Session, session);

      // Listen for events
      listeners(this, socket);

      // Handle the disconnect event
      socket.on('disconnect', () => {
        this.sessionManager.deleteSession(socket);
        logger.debug('User disconnected');
      });
    });

    // Listen for server errors
    this.io.on('error', error => {
      logger.error(`Server error: ${error}`);
    });
  }

  /**
   * Creates a new Socket.IO server
   */
  private createIOServer(): IOServer {
    return new IOServer({
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET']
      }
    });
  }

  /**
   * Creates a new session manager
   */
  private createSessionManager(): SessionManager {
    return new SessionManager();
  }

  /**
   * Creates a new room manager
   */
  private createRoomManager(): RoomManager {
    return new RoomManager({
      onUserAddedToRoom: this.handleUserAddedToRoom.bind(this),
      onUserRemovedFromRoom: this.handleUserRemovedFromRoom.bind(this)
    });
  }

  /**
   * Handles the user added to room event
   */
  private handleUserAddedToRoom(sessionId: string, roomJoinCode: string) {
    const { socketId } = this.sessionManager.getSessionById(sessionId) || {};
    if (socketId) {
      this.io.sockets.sockets.get(socketId)?.join(roomJoinCode);
    }
  }

  /**
   * Handles the user removed from room event
   */
  private handleUserRemovedFromRoom(sessionId: string, roomJoinCode: string) {
    const { socketId } = this.sessionManager.getSessionById(sessionId) || {};
    if (socketId) {
      this.io.sockets.sockets.get(socketId)?.leave(roomJoinCode);
    }
  }
}
