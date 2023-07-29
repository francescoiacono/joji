import { Game, RoomUser, RoomUserOptions } from '@/services';
import { RoomClient } from '@joji/types';
import { EventEmitter } from '../event-emitter';
import { logger } from '@/utils';
import { RoomConfig } from '@joji/config';

export type RoomEvents = {
  userAdded: (data: { room: Room; roomUser: RoomUser }) => void;
  userRemoved: (data: { room: Room; roomUser: RoomUser }) => void;
  roomUpdated: (data: { room: Room }) => void;
};

interface RoomOptions {
  joinCode: string;
}

export class Room {
  public events: EventEmitter<RoomEvents> = new EventEmitter();
  public hostId: RoomUser['userId'] | null = null;
  public joinCode: string;
  public users: Array<RoomUser> = [];
  public game: Game | null = null;

  constructor(options: RoomOptions) {
    this.joinCode = options.joinCode;
  }

  /**
   * Adds a user to the room
   */
  public addUser(options: RoomUserOptions): RoomUser {
    // If the user is already in the room, do nothing
    const existingUser = this.getUser(options.userId);
    if (existingUser) {
      return existingUser;
    }

    // Create the user
    const roomUser = new RoomUser(options);

    // Add the user to the room
    this.users.push(roomUser);

    // Add a listener for the user's roomUserUpdated event
    roomUser.events.on('roomUserUpdated', () => {
      this.events.emit('roomUpdated', { room: this });
    });

    // Emit the userAdded event
    this.events.emit('userAdded', { room: this, roomUser });
    this.events.emit('roomUpdated', { room: this });

    // Return the user
    return roomUser;
  }

  /**
   * Removes a user from the room
   */
  public removeUser(userId: RoomUser['userId']): void {
    // If the user is not in the room, do nothing
    if (!this.getUser(userId)) {
      return;
    }

    // Remove the user from the room
    const index = this.users.findIndex(u => u.userId === userId);
    const roomUser = this.users[index];
    this.users.splice(index, 1);

    // If the user being removed is the host, reassign the host
    if (this.isHost(userId) && this.users.length > 0) {
      this.reassignHost();
    }

    // Emit the userRemoved event
    this.events.emit('userRemoved', { room: this, roomUser });
    this.events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns the user with the given user id
   */
  public getUser(userId: RoomUser['userId']): RoomUser | null {
    return this.users.find(u => u.userId === userId) ?? null;
  }

  /**
   * Returns a user by their display name, case insensitive
   */
  public getUserByDisplayName(
    displayName: RoomUser['displayName']
  ): RoomUser | null {
    const lower = displayName.toLowerCase();
    return this.users.find(u => u.displayName.toLowerCase() === lower) ?? null;
  }

  /**
   * Returns whether the room is full
   */
  public isFull(): boolean {
    return this.users.length >= RoomConfig.maxUsers;
  }

  /**
   * Sets the host of the room
   */
  public setHost(userId: RoomUser['userId']): void {
    // If the user is not in the room, do nothing
    if (!this.getUser(userId)) {
      logger.warn('setHost: user is not in room');
      return;
    }

    // Set the host
    this.hostId = userId;

    // Emit the roomUpdated event
    this.events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns if the user is the host of the room
   */
  public isHost(userId: RoomUser['userId']): boolean {
    return this.hostId === userId;
  }

  /**
   * Reassigns the host of the room to another user
   */
  public reassignHost(): void {
    // If there are no users left in the room, set the host to null
    if (this.users.length === 0) {
      this.hostId = null;
    }

    // Otherwise, set the host to the first user in the room
    else {
      this.hostId = this.users[0].userId;
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
  public getClient(userId?: RoomUser['userId']): RoomClient {
    return {
      joinCode: this.joinCode,
      host: this.hostId ?? null,
      users: this.users.map(u =>
        u.getClient({
          isHost: this.isHost(u.userId)
        })
      ),
      isUserInRoom: this.users.some(u => u.userId === userId),
      isUserHost: this.isHost(userId ?? ''),
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

  /**
   * Set the game options
   */
  public setGameOptions(options: Game['options']): void {
    // If there is no game, do nothing
    if (!this.game) {
      return;
    }

    // Update the game options
    this.game.updateOptions(options);

    // Emit the roomUpdated event
    this.events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns if all room users are online
   */
  public areAllUsersOnline(): boolean {
    return this.users.every(u => u.isOnline);
  }
}
