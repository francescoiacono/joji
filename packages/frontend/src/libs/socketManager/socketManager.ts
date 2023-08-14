import { Socket, io } from 'socket.io-client';
import { Session } from './session';

class SocketManager {
  private static instance: SocketManager;
  private socketInstance: Socket;
  private readonly serverURL: string;
  private session: Session;

  private constructor() {
    this.session = new Session();
    this.serverURL = this.getServerURL();
    this.socketInstance = this.connect();
  }

  get socket() {
    return this.socketInstance;
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  disconnect() {
    if (this.socketInstance) {
      this.session.unsubscribe(this.socketInstance);
      this.socketInstance.disconnect();
    }
  }

  private getServerURL(): string {
    const url = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!url) {
      throw new Error(
        'SERVER_URL is not defined. Please ensure you have set the NEXT_PUBLIC_SERVER_URL environment variable.'
      );
    }
    return url;
  }

  private connect() {
    if (!this.socketInstance) {
      this.socketInstance = io(this.serverURL, { autoConnect: false });
      this.socketInstance.auth = { sessionId: this.session.getSessionId() };
      this.socketInstance.connect();

      this.session.initSessionListener(this.socketInstance);
    }
    return this.socketInstance;
  }
}

export default SocketManager;
