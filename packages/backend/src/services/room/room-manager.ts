import { randomString } from '@/utils';
import { RoomUser } from '@/services';
import { Room } from './room';

interface CreateRoomOptions {
  host: RoomUser;
}

export class RoomManager {
  private rooms: Map<Room['id'], Room>;
  private joinCodes: Set<string>;

  constructor() {
    this.rooms = new Map();
    this.joinCodes = new Set();
  }

  /**
   * Creates a new room and returns it
   */
  public createRoom(options: CreateRoomOptions): Room {
    const { host } = options;

    const joinCode = this.generateUniqueJoinCode();
    const room = new Room({ joinCode, host });

    this.rooms.set(room.id, room);
    this.joinCodes.add(joinCode);

    return room;
  }

  /**
   * Deletes the room with the given ID
   */
  public deleteRoom(id: Room['id']): void {
    const room = this.rooms.get(id);
    if (room) {
      this.rooms.delete(id);
      this.joinCodes.delete(room.joinCode);
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
    return this.joinCodes.has(joinCode);
  }
}
