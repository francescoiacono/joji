import { randomString } from '@/utils';
import { RoomUser, Session } from '@/services';
import { Room } from './room';

interface CreateRoomOptions {
  host: RoomUser;
}

export class RoomManager {
  private rooms: Map<Room['joinCode'], Room>;
  private roomUsers: Map<Session['id'], Room['joinCode']>;

  constructor() {
    this.rooms = new Map();
    this.roomUsers = new Map();
  }

  /**
   * Returns the room with the given join code
   */
  public getRoom(joinCode: Room['joinCode']): Room | undefined {
    return this.rooms.get(joinCode);
  }

  /**
   * Returns the room that the user with the given session is in
   */
  public getUserRoom(sessionId: Session['id']): Room | undefined {
    const joinCode = this.roomUsers.get(sessionId);
    if (joinCode) {
      return this.getRoom(joinCode);
    }
  }

  /**
   * Creates a new room, adds the host to it, and returns it
   */
  public createRoom(options: CreateRoomOptions): Room {
    const { host } = options;

    const joinCode = this.generateUniqueJoinCode();
    const room = new Room({ joinCode, host });

    this.rooms.set(room.joinCode, room);
    this.roomUsers.set(host.sessionId, room.joinCode);

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
        this.roomUsers.delete(user.sessionId);
      });

      // Delete the room
      this.rooms.delete(joinCode);
    }
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
