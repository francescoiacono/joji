import { RoomManager, SessionManager } from '@/services';
import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';
import { RoomEvent } from '@joji/types';
import { createRoomHandler } from '@/listeners';

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
    this.io = new IOServer();
    this.sessionManager = new SessionManager();
    this.roomManager = new RoomManager();
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

      // Listen for events
      socket.on(RoomEvent.CreateRoom, data =>
        createRoomHandler({ server: this, socket, data })
      );

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
