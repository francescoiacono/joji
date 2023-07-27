import { Game, RoomUser } from '@/services';
import { RoomClient } from '@joji/types';
import { EventEmitter } from '../event-emitter';
import { logger } from '@/utils';

export type RoomEvents = {
  userAdded: (data: { room: Room; user: RoomUser }) => void;
  userRemoved: (data: { room: Room; user: RoomUser }) => void;
  roomUpdated: (data: { room: Room }) => void;
};

interface RoomOptions {
  joinCode: string;
}

export class Room {
  public events: EventEmitter<RoomEvents> = new EventEmitter();
  public joinCode: string;
  public host: RoomUser | null = null;
  public users: Array<RoomUser> = [];
  public game: Game | null = null;

  constructor(options: RoomOptions) {
    this.joinCode = options.joinCode;
  }

  /**
   * Adds a user to the room
   */
  public addUser(user: RoomUser): void {
    // If the user is already in the room, do nothing
    if (this.getUser(user.sessionId)) {
      return;
    }

    // Add the user to the room
    this.users.push(user);

    // Emit the userAdded event
    this.events.emit('userAdded', { room: this, user });
    this.events.emit('roomUpdated', { room: this });
  }

  /**
   * Removes a user from the room
   */
  public removeUser(sessionId: RoomUser['sessionId']): void {
    // If the user is not in the room, do nothing
    if (!this.getUser(sessionId)) {
      return;
    }

    // Remove the user from the room
    const index = this.users.findIndex(u => u.sessionId === sessionId);
    const user = this.users[index];
    this.users.splice(index, 1);

    // If the user being removed is the host, reassign the host
    if (this.host && this.host.sessionId === sessionId) {
      this.reassignHost();
    }

    // Emit the userRemoved event
    this.events.emit('userRemoved', { room: this, user });
    this.events.emit('roomUpdated', { room: this });
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
    // If the user is not in the room, do nothing
    if (!this.getUser(user.sessionId)) {
      logger.warn('setHost: user is not in room');
      return;
    }

    // Set the host
    this.host = user;

    // Emit the roomUpdated event
    this.events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns if the user is the host of the room
   */
  public isHost(sessionId: RoomUser['sessionId']): boolean {
    return this.host?.sessionId === sessionId;
  }

  /**
   * Reassigns the host of the room to another user
   */
  public reassignHost(): void {
    // If there are no users left in the room, set the host to null
    if (this.users.length === 0) {
      this.host = null;
    }

    // Otherwise, set the host to the first user in the room
    else {
      this.host = this.users[0];
    }

    // Emit the roomUpdated event
    this.events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns if a display name is taken
   */
  public isDisplayNameTaken(displayName: RoomUser['displayName']): boolean {
    const name = displayName.toLowerCase();
    return this.users.some(u => u.displayName.toLowerCase() === name);
  }

  /**
   * Returns the room data for the client
   */
  public getClient(sessionId?: RoomUser['sessionId']): RoomClient {
    return {
      joinCode: this.joinCode,
      host: this.host?.getClient() ?? null,
      users: this.users.map(u => u.getClient()),
      isUserInRoom: this.users.some(u => u.sessionId === sessionId),
      game: this.game?.getClient() ?? null
    };
  }

  /**
   * Set the game
   */
  public setGame(game: Game | null): void {
    this.game = game;

    // Emit the roomUpdated event
    this.events.emit('roomUpdated', { room: this });
  }
}
