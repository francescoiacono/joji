import { containsBadWord, randomString } from '@/utils';
import { RoomUser, Session } from '@/services';
import { Room } from './room';
import { EventEmitter } from '../event-emitter';

export type RoomManagerEvents = {
  roomCreated: (data: { room: Room }) => void;
  roomUpdated: (data: { room: Room }) => void;
  roomDeleted: (data: { room: Room }) => void;
  userAddedToRoom: (data: { user: RoomUser; room: Room }) => void;
  userRemovedFromRoom: (data: { user: RoomUser; room: Room }) => void;
};

export class RoomManager {
  public events: EventEmitter<RoomManagerEvents>;
  private rooms: Map<Room['joinCode'], Room>;
  private roomUsers: Map<Session['id'], Room['joinCode']>;

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
   * Returns the room that the user with the given session is in
   */
  public getUserRoom(sessionId: Session['id']): Room | null {
    const joinCode = this.roomUsers.get(sessionId);

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
      this.removeUserFromRoom(user.sessionId);
    });

    // Delete the room
    this.rooms.delete(joinCode);

    // Emit events
    this.events.emit('roomDeleted', { room });
  }

  /**
   * Adds a user to the room with the given join code
   */
  public addUserToRoom(
    user: RoomUser,
    joinCode: Room['joinCode']
  ): Room | null {
    const room = this.getRoom(joinCode);

    // If the room does not exist, return null
    if (!room) {
      return null;
    }

    // If the user is already in the room, return the room
    if (room.isUserInRoom(user.sessionId)) {
      return room;
    }

    // Add the user to the room
    room.addUser(user);
    this.roomUsers.set(user.sessionId, room.joinCode);

    // Emit events
    this.events.emit('userAddedToRoom', { user, room });
    this.events.emit('roomUpdated', { room });

    // Return the room
    return room;
  }

  /**
   * Removes a user from the room they are in
   */
  public removeUserFromRoom(sessionId: Session['id']): Room | null {
    const room = this.getUserRoom(sessionId);

    // If the room does not exist, return null
    if (!room) {
      return null;
    }

    // If the user is not in the room, return the room
    const user = room.getUser(sessionId);
    if (!user) {
      return room;
    }

    // Remove the user from the room
    room.removeUser(sessionId);
    this.roomUsers.delete(sessionId);

    // If the room is empty, delete it
    if (room.users.length === 0) {
      this.deleteRoom(room.joinCode);
      return null;
    }

    // Reassign the host if the host left
    if (!room.host || room.host.sessionId === sessionId) {
      this.assignNewHost(room);
    }

    // Emit events
    this.events.emit('userRemovedFromRoom', { user, room });
    this.events.emit('roomUpdated', { room });

    // Return the room
    return room;
  }

  /**
   * Assigns a new host to a room
   */
  private assignNewHost(room: Room): void {
    const newHost = room.users[0];
    if (newHost) {
      room.setHost(newHost);
    }
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
}
