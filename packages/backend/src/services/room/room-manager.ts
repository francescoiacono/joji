import { randomString } from '@/utils';
import { RoomUser, Session } from '@/services';
import { Room } from './room';

interface RoomManagerOptions {
  onUserAddedToRoom?: (sessionId: string, roomCode: string) => void;
  onUserRemovedFromRoom?: (sessionId: string, roomCode: string) => void;
}

interface CreateRoomOptions {
  host: RoomUser;
}
interface AddUserToRoomOptions {
  user: RoomUser;
  joinCode: Room['joinCode'];
}

export class RoomManager {
  private rooms: Map<Room['joinCode'], Room>;
  private roomUsers: Map<Session['id'], Room['joinCode']>;
  private onUserAddedToRoom?: (sessionId: string, roomCode: string) => void;
  private onUserRemovedFromRoom?: (sessionId: string, roomCode: string) => void;

  constructor(options?: RoomManagerOptions) {
    this.rooms = new Map();
    this.roomUsers = new Map();
    this.onUserAddedToRoom = options?.onUserAddedToRoom;
    this.onUserRemovedFromRoom = options?.onUserRemovedFromRoom;
  }

  /**
   * Returns the room with the given join code
   */
  public getRoom(joinCode: Room['joinCode']): Room | null {
    return this.rooms.get(joinCode) ?? null;
  }

  /**
   * Returns the room that the user with the given session is in
   */
  public getUserRoom(sessionId: Session['id']): Room | null {
    const joinCode = this.roomUsers.get(sessionId);
    if (joinCode) {
      return this.getRoom(joinCode) ?? null;
    }
    return null;
  }

  /**
   * Creates a new room, adds the host to it, and returns it
   */
  public createRoom(options: CreateRoomOptions): Room {
    const { host } = options;

    const joinCode = this.generateUniqueJoinCode();
    const room = new Room({ joinCode, host });

    this.rooms.set(room.joinCode, room);
    this.addUserToRoom({ user: host, joinCode: room.joinCode });

    return room;
  }

  /**
   * Deletes the room with the given code
   */
  public deleteRoom(joinCode: Room['joinCode']): void {
    const room = this.getRoom(joinCode);
    if (room) {
      // Remove all users from the room
      room.users.forEach(user => {
        this.removeUserFromRoom(user.sessionId);
      });

      // Delete the room
      this.rooms.delete(joinCode);
    }
  }

  /**
   * Adds a user to the room with the given join code
   */
  public addUserToRoom(options: AddUserToRoomOptions): Room | null {
    const { user, joinCode } = options;
    const room = this.getRoom(joinCode);
    if (room) {
      room.addUser(user);
      this.roomUsers.set(user.sessionId, room.joinCode);

      // Call the onUserAddedToRoom callback
      if (this.onUserAddedToRoom) {
        this.onUserAddedToRoom(user.sessionId, room.joinCode);
      }
    }
    return room;
  }

  /**
   * Removes a user from the room they are in
   */
  public removeUserFromRoom(sessionId: Session['id']): Room | null {
    const room = this.getUserRoom(sessionId);
    console.log(room);
    if (room) {
      room.removeUser(sessionId);
      this.roomUsers.delete(sessionId);

      // If the user was the host, re-assign the host
      if (room.host.sessionId === sessionId) {
        const newHost = room.users[0];
        if (newHost) {
          room.setHost(newHost);
        }
      }

      // If the room is empty after re-assigning the host, delete it
      if (room.users.length === 0) {
        this.deleteRoom(room.joinCode);
      }

      // Call the onUserRemovedFromRoom callback
      if (this.onUserRemovedFromRoom) {
        this.onUserRemovedFromRoom(sessionId, room.joinCode);
      }
    }
    return room;
  }

  /**
   * Generates a new, unique, join code and returns it
   */
  private generateUniqueJoinCode(): string {
    let joinCode;
    do {
      joinCode = `${randomString(3)}-${randomString(3)}`;
    } while (this.joinCodeExists(joinCode));
    return joinCode;
  }

  /**
   * Returns if a join code exists
   */
  private joinCodeExists(joinCode: string): boolean {
    return this.rooms.has(joinCode);
  }
}
