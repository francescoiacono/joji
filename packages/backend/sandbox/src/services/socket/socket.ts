'use client';

import { io, Socket as SocketIO } from 'socket.io-client';

export class Socket {
  private static _instance: Socket;
  private _socket: SocketIO;

  private constructor() {
    this._socket = io('http://localhost:8000', { autoConnect: false });
  }

  private static get instance(): Socket {
    if (typeof window === 'undefined') {
      throw new Error('Socket can only be used in the browser');
    }
    if (!Socket._instance) {
      Socket._instance = new Socket();
    }
    return Socket._instance;
  }

  public static get socket(): SocketIO {
    return Socket.instance._socket;
  }
}
