import { RoomService, SessionService } from '@/services';
import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';
import { SocketEvent } from '@joji/types';
import { listeners } from '@/listeners';
import { UserService } from '../user/user-manager';

interface ServerStartOptions {
  port?: number;
}

export class Server {
  public sessionService: SessionService;
  public userService: UserService;
  public roomService: RoomService;
  public io: IOServer;

  constructor() {
    this.io = this.createIOServer();
    this.userService = new UserService();
    this.sessionService = new SessionService({ userService: this.userService });
    this.roomService = new RoomService();
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

    // Create event listeners
    this.createEventListeners();

    // Listen for new connections
    this.io.on('connection', socket => {
      // Get the session and send it to the client
      const session = this.sessionService.getSessionBySocket(socket);
      socket.emit(SocketEvent.Session, session.getClient());

      // Clear the disconnect timeout
      this.sessionService.clearDisconnectTimeout(session);

      // Log the connection event
      logger.debug('🔌 User connected', { sessionId: session.id });

      // Listen for events
      listeners(this, socket);

      // Handle the disconnect event
      socket.on('disconnect', () => {
        // Start the disconnect timeout
        this.sessionService.onSocketDisconnect(socket);
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
   * Creates listeners for cross-server events
   */
  private createEventListeners(): void {
    // Remove the user from the room when their session is deleted
    this.sessionService.events.on('sessionDeleted', data => {
      const room = this.roomService.getUserRoom(data.session.user.id);
      room?.removeUser(data.session.user.id);
    });

    // Set the user's online status when their session becomes idle
    this.sessionService.events.on('sessionIdle', data => {
      const room = this.roomService.getUserRoom(data.session.user.id);
      room?.getUser(data.session.user.id)?.setOnlineStatus(false);
    });
    this.sessionService.events.on('sessionActive', data => {
      const room = this.roomService.getUserRoom(data.session.user.id);
      room?.getUser(data.session.user.id)?.setOnlineStatus(true);
    });
  }
}
