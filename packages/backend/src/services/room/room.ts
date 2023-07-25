import { RoomUser } from '@/services';

interface RoomOptions {
  joinCode: string;
  host: RoomUser;
}

export class Room {
  public joinCode: string;
  public host: RoomUser;
  public users: Array<RoomUser> = [];

  constructor(options: RoomOptions) {
    this.joinCode = options.joinCode;
    this.host = options.host;

    this.addUser(this.host);
  }

  /**
   * Adds a user to the room
   */
  public addUser(user: RoomUser): void {
    if (!this.isUserInRoom(user)) {
      this.users.push(user);
    } else {
      throw new Error('User is already in the room');
    }
  }

  /**
   * Checks if a user is already in the room
   */
  public isUserInRoom(user: RoomUser): boolean {
    return this.users.some(u => u.sessionId === user.sessionId);
  }

  /**
   * Removes a user from the room
   */
  public removeUser(sessionId: RoomUser['sessionId']): void {
    const index = this.users.findIndex(u => u.sessionId === sessionId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  /**
   * Sets the host of the room
   */
  public setHost(user: RoomUser): void {
    this.host = user;
  }
}
