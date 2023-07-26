import { RoomManager, SessionManager } from '@/services';
import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';
import { SocketEvent } from '@joji/types';
import { listeners } from '@/listeners';

interface ServerStartOptions {
  port?: number;
}

/**
 * This class encapsulates the Socket.IO server
 */
export class Server {
  public sessionManager: SessionManager;
  public roomManager: RoomManager;
  private io: IOServer;

  constructor() {
    this.io = new IOServer({
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET']
      }
    });
    this.sessionManager = new SessionManager();
    this.roomManager = new RoomManager();
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
      const session = this.sessionManager.getSession(socket);
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
}
