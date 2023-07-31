import { Socket } from 'socket.io';
import { User } from '../user';
import { SessionClient } from '@joji/types';

export interface SessionOptions {
  id: string;
  socketIds: Set<Socket['id']>;
  user: User;
}

export class Session {
  private _id: string;
  private _socketIds: Set<Socket['id']>;
  private _user: User;

  constructor(options: SessionOptions) {
    this._id = options.id;
    this._socketIds = options.socketIds;
    this._user = options.user;
  }

  /**
   * Returns the session ID
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Returns all socket IDs in the session
   */
  public get socketIds(): Array<Socket['id']> {
    return Array.from(this._socketIds);
  }

  /**
   * Returns the user
   */
  public get user(): User {
    return this._user;
  }

  /**
   * Adds a socket ID to the session
   */
  public addSocketId(socketId: Socket['id']): void {
    this._socketIds.add(socketId);
  }

  /**
   * Removes a socket ID from the session
   */
  public removeSocketId(socketId: Socket['id']): void {
    this._socketIds.delete(socketId);
  }

  /**
   * Returns the session data to send to the client
   */
  public getClient(): SessionClient {
    return {
      id: this._id,
      user: this._user?.getClient() || null
    };
  }
}
