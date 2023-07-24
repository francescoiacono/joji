import { logger } from '@/utils/logger';
import { Server as IOServer } from 'socket.io';

interface ServerStartOptions {
  port?: number;
}

export class Server {
  private io: IOServer;

  constructor() {
    this.io = new IOServer();
  }

  public start(options: ServerStartOptions = {}): void {
    const port = Number(process.env.PORT) || options.port || 3000;
    this.io.listen(port);

    logger.info(`🚀 Server listening on port ${port}`);

    this.io.on('connection', socket => {
      logger.debug('A user connected');

      socket.on('disconnect', () => {
        logger.debug('User disconnected');
      });
    });
  }
}
