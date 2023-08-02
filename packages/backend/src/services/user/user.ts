import { UserClient } from '@joji/types';

interface UserOptions {
  id: string;
}

export class User {
  private _id: string;

  constructor(options: UserOptions) {
    this._id = options.id;
  }

  /**
   * Returns the user ID
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Returns the user data to send to the client
   */
  public getClient(): UserClient {
    return {
      id: this._id
    };
  }
}
