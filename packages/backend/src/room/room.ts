import { RoomUser } from '@/room-user';
import { v4 as uuidv4 } from 'uuid';

interface RoomOptions {
  joinCode: string;
  host: RoomUser;
}

export class Room {
  public id: string;
  public joinCode: string;
  public host: RoomUser;
  public users: Array<RoomUser> = [];

  constructor(options: RoomOptions) {
    this.id = uuidv4();
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
  public removeUser(user: RoomUser): void {
    const index = this.users.findIndex(u => u.sessionId === user.sessionId);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}
