import { RoomUser } from '@/services';
import { RoomClient } from '@joji/types';

interface RoomOptions {
  joinCode: string;
}

export class Room {
  public joinCode: string;
  public host: RoomUser | null = null;
  public users: Array<RoomUser> = [];

  constructor(options: RoomOptions) {
    this.joinCode = options.joinCode;
  }

  /**
   * Adds a user to the room
   */
  public addUser(user: RoomUser): void {
    if (!this.isUserInRoom(user.sessionId)) {
      this.users.push(user);
    }
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
   * Returns the user with the given session id
   */
  public getUser(sessionId: RoomUser['sessionId']): RoomUser | null {
    return this.users.find(u => u.sessionId === sessionId) ?? null;
  }

  /**
   * Sets the host of the room
   */
  public setHost(user: RoomUser): void {
    this.host = user;
  }

  /**
   * Returns if a display name is taken
   */
  public isDisplayNameTaken(displayName: RoomUser['displayName']): boolean {
    return this.users.some(
      u => u.displayName.toLowerCase() === displayName.toLowerCase()
    );
  }

  /**
   * Returns the room data for the client
   */
  public getClient(sessionId?: RoomUser['sessionId']): RoomClient {
    return {
      joinCode: this.joinCode,
      host: this.host?.getClient() ?? null,
      users: this.users.map(u => u.getClient()),
      isUserInRoom: this.users.some(u => u.sessionId === sessionId)
    };
  }

  /**
   * Checks if a user is already in the room
   */
  public isUserInRoom(user: RoomUser['sessionId']): boolean {
    return this.users.some(u => u.sessionId === user);
  }
}
