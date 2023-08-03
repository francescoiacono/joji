import { GameController, RoomController, SessionService } from '@/services';
import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';
import { SocketEvent } from '@joji/types';
import { UserService } from '../user/user-manager';

interface ServerStartOptions {
  port?: number;
}

export class Server {
  private sessionService: SessionService;
  private userService: UserService;
  private roomController: RoomController;
  private gameController: GameController;
  private io: IOServer;

  constructor() {
    this.io = this.createIOServer();
    this.userService = new UserService();
    this.sessionService = new SessionService({ userService: this.userService });
    this.roomController = new RoomController(this.io, this.sessionService);
    this.gameController = new GameController(
      this.io,
      this.sessionService,
      this.roomController.roomService
    );
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
      // Get the session and send it to the client
      const session = this.sessionService.getSessionBySocket(socket);
      socket.emit(SocketEvent.Session, session.getClient());

      // Clear the disconnect timeout
      this.sessionService.clearDisconnectTimeout(session);

      // Log the connection event
      logger.debug('🔌 User connected', { sessionId: session.id });

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
}
