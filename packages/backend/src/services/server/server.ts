import {
  Room,
  RoomManager,
  RoomManagerEvents,
  SessionManager
} from '@/services';
import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';
import { RoomEvent, SocketEvent } from '@joji/types';
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
    const roomManager = new RoomManager();
    roomManager.events.on('roomUpdated', this.handleRoomUpdated.bind(this));
    roomManager.events.on(
      'userAddedToRoom',
      this.handleUserAddedToRoom.bind(this)
    );
    roomManager.events.on(
      'userRemovedFromRoom',
      this.handleUserRemovedFromRoom.bind(this)
    );
    return roomManager;
  }

  /**
   * Handles the user added to room event
   */
  private handleUserAddedToRoom: RoomManagerEvents['userAddedToRoom'] =
    data => {
      const { user, room } = data;
      const { socketId } =
        this.sessionManager.getSessionById(user.sessionId) || {};
      if (socketId) {
        this.io.sockets.sockets.get(socketId)?.join(room.joinCode);
      }
    };

  /**
   * Handles the user removed from room event
   */
  private handleUserRemovedFromRoom: RoomManagerEvents['userRemovedFromRoom'] =
    data => {
      const { user, room } = data;
      const { socketId } =
        this.sessionManager.getSessionById(user.sessionId) || {};
      if (socketId) {
        this.io.sockets.sockets.get(socketId)?.leave(room.joinCode);
      }
    };

  /**
   * Handles the room updated event
   */
  private handleRoomUpdated: RoomManagerEvents['roomUpdated'] = data => {
    const { room } = data;

    // Send an event to all users in the room
    room.users.forEach(user => {
      const { socketId } =
        this.sessionManager.getSessionById(user.sessionId) || {};
      if (socketId) {
        const roomClient = room.getClient(user.sessionId);
        this.io.to(socketId).emit(RoomEvent.RoomUpdated, roomClient);
      }
    });
  };
}
