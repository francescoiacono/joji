import { containsBadWord, randomString } from '@/utils';
import { Room, RoomEvents } from './room';
import { EventEmitter } from '../event-emitter';
import { User } from '../user';

export type RoomManagerEvents = {
  roomCreated: (data: { room: Room }) => void;
  roomDeleted: (data: { room: Room }) => void;
  roomUpdated: RoomEvents['roomUpdated'];
};

export class RoomManager {
  public events: EventEmitter<RoomManagerEvents>;
  private rooms: Map<Room['joinCode'], Room>;
  private roomUsers: Map<User['id'], Room['joinCode']>;

  constructor() {
    this.events = new EventEmitter<RoomManagerEvents>();
    this.rooms = new Map();
    this.roomUsers = new Map();
  }

  /**
   * Returns the room with the given join code
   */
  public getRoom(joinCode: Room['joinCode']): Room | null {
    return this.rooms.get(joinCode) ?? null;
  }

  /**
   * Returns all rooms
   */
  public getRooms(): Array<Room> {
    return Array.from(this.rooms.values());
  }

  /**
   * Returns the room that the user with the given ID is in
   */
  public getUserRoom(userId: User['id']): Room | null {
    // Get the join code of the room the user is in
    const joinCode = this.roomUsers.get(userId);

    // If the user is not in a room, return null
    if (!joinCode) {
      return null;
    }

    // Return the room
    return this.getRoom(joinCode) ?? null;
  }

  /**
   * Creates a new room
   */
  public createRoom(): Room {
    const joinCode = this.generateUniqueJoinCode();
    const room = new Room({ joinCode });

    // Add the room to the map
    this.rooms.set(room.joinCode, room);

    // Emit events
    this.events.emit('roomCreated', { room });

    // Subscribe to events
    room.events.on('userRemoved', this.handleUserRemoved);
    room.events.on('userAdded', this.handleUserAdded);
    room.events.on('roomUpdated', this.handleRoomUpdated);

    // Return the room
    return room;
  }

  /**
   * Deletes the room with the given code
   */
  public deleteRoom(joinCode: Room['joinCode']): void {
    const room = this.getRoom(joinCode);

    // If the room does not exist, return
    if (!room) {
      return;
    }

    // Remove all users from the room
    room.users.forEach(user => {
      room.removeUser(user.userId);
    });

    // Unsubscribe from events
    room.events.off('userRemoved', this.handleUserRemoved);
    room.events.off('userAdded', this.handleUserAdded);
    room.events.off('roomUpdated', this.handleRoomUpdated);

    // Delete the room
    this.rooms.delete(joinCode);

    // Emit events
    this.events.emit('roomDeleted', { room });
  }

  /**
   * Generates a new, unique, join code and returns it
   */
  private generateUniqueJoinCode(): string {
    let joinCode;
    do {
      joinCode = `${randomString(3)}-${randomString(3)}`;
    } while (this.joinCodeExists(joinCode) || containsBadWord(joinCode));
    return joinCode;
  }

  /**
   * Returns if a join code exists
   */
  private joinCodeExists(joinCode: string): boolean {
    return this.rooms.has(joinCode);
  }

  /**
   * Handle a user being added to a room
   */
  private handleUserAdded: RoomEvents['userAdded'] = data => {
    const { room, roomUser } = data;

    // Add the user to the roomUsers map
    this.roomUsers.set(roomUser.userId, room.joinCode);
  };

  /**
   * Handle a user being removed from a room
   */
  private handleUserRemoved: RoomEvents['userRemoved'] = data => {
    const { room, roomUser } = data;

    // Remove the user from the roomUsers map
    this.roomUsers.delete(roomUser.userId);

    // If the room is empty, delete it
    if (room.users.length === 0) {
      this.deleteRoom(room.joinCode);
    }
  };

  /**
   * Handle a room being updated
   */
  private handleRoomUpdated: RoomEvents['roomUpdated'] = data => {
    // Emit events
    this.events.emit('roomUpdated', data);
  };
}
