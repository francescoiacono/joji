import { Socket } from 'socket.io';
import { User } from '../user';
import { SessionClient } from '@joji/types';

export interface SessionOptions {
  id: string;
  socketId: string;
  user: User;
}

export class Session {
  public id: string;
  public socketId: Socket['id'];
  public user: User;

  constructor(options: SessionOptions) {
    this.id = options.id;
    this.socketId = options.socketId;
    this.user = options.user;
  }

  /**
   * Returns the session data to send to the client
   */
  public getClient(): SessionClient {
    return {
      id: this.id,
      user: this.user?.getClient() || null
    };
  }
}
