import { SessionManager } from '@/session';
import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';

interface ServerStartOptions {
  port?: number;
}

/**
 * This class encapsulates the Socket.IO server
 */
export class Server {
  private io: IOServer;
  private sessionManager: SessionManager;

  constructor() {
    this.io = new IOServer();
    this.sessionManager = new SessionManager();
  }

  /**
   * Start the Socket.IO server
   */
  public start(options: ServerStartOptions = {}): void {
    // Start the server
    const port = Number(process.env.PORT) || options.port || 3000;
    this.io.listen(port);

    // Log the server start event
    logger.info(`🚀 Server listening on port ${port}`);

    // Listen for new connections
    this.io.on('connection', socket => {
      logger.debug('A user connected');

      // Get the session
      const session = this.sessionManager.getSession(socket);
      logger.debug(`Session ID: ${session.id}`);

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
