import { UserClient } from '@joji/types';

interface UserOptions {
  id: string;
  socketId: string;
}

export class User {
  public id: string;
  public socketId: string;

  constructor(options: UserOptions) {
    this.id = options.id;
    this.socketId = options.socketId;
  }

  /**
   * Returns the user data to send to the client
   */
  public getClient(): UserClient {
    return {
      id: this.id
    };
  }
}
