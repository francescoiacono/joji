import { UserClient } from '@joji/types';

interface UserOptions {
  id: string;
}

export class User {
  public id: string;

  constructor(options: UserOptions) {
    this.id = options.id;
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
