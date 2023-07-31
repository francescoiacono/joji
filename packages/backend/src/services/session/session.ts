import { Socket } from 'socket.io';
import { User } from '../user';
import { SessionClient } from '@joji/types';

export interface SessionOptions {
  id: string;
  socketIds: Set<Socket['id']>;
  user: User;
}

export class Session {
  public id: string;
  public socketIds: Set<Socket['id']>;
  public user: User;

  constructor(options: SessionOptions) {
    this.id = options.id;
    this.socketIds = options.socketIds;
    this.user = options.user;
  }

  /**
   * Adds a socket ID to the session
   */
  public addSocketId(socketId: Socket['id']): void {
    this.socketIds.add(socketId);
  }

  /**
   * Removes a socket ID from the session
   */
  public removeSocketId(socketId: Socket['id']): void {
    this.socketIds.delete(socketId);
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
