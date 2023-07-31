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
  private _events: EventEmitter<RoomEvents> = new EventEmitter();
  private _hostId: RoomUser['userId'] | null = null;
  private _joinCode: string;
  private _users: Array<RoomUser> = [];
  private _game: Game | null = null;

  constructor(options: RoomOptions) {
    this._joinCode = options.joinCode;
  }

  /**
   * Returns the `RoomEvents` event emitter
   */
  public get events(): EventEmitter<RoomEvents> {
    return this._events;
  }

  /**
   * Returns the room's host ID
   */
  public get hostId(): RoomUser['userId'] | null {
    return this._hostId;
  }

  /**
   * Returns the room's join code
   */
  public get joinCode(): string {
    return this._joinCode;
  }

  /**
   * Returns the room's users
   */
  public get users(): Array<RoomUser> {
    return this._users;
  }

  /**
   * Returns the room's game
   */
  public get game(): Game | null {
    return this._game;
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
    this._users.push(roomUser);

    // Add a listener for the user's roomUserUpdated event
    roomUser.events.on('roomUserUpdated', () => {
      this._events.emit('roomUpdated', { room: this });
    });

    // Emit the userAdded event
    this._events.emit('userAdded', { room: this, roomUser });
    this._events.emit('roomUpdated', { room: this });

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
    const index = this._users.findIndex(u => u.userId === userId);
    const roomUser = this._users[index];
    this._users.splice(index, 1);

    // If the user being removed is the host, reassign the host
    if (this.isHost(userId) && this._users.length > 0) {
      this.reassignHost();
    }

    // Emit the userRemoved event
    this._events.emit('userRemoved', { room: this, roomUser });
    this._events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns the user with the given user id
   */
  public getUser(userId: RoomUser['userId']): RoomUser | null {
    return this._users.find(u => u.userId === userId) ?? null;
  }

  /**
   * Returns a user by their display name, case insensitive
   */
  public getUserByDisplayName(
    displayName: RoomUser['displayName']
  ): RoomUser | null {
    const lower = displayName.toLowerCase();
    return this._users.find(u => u.displayName.toLowerCase() === lower) ?? null;
  }

  /**
   * Returns whether the room is full
   */
  public isFull(): boolean {
    return this._users.length >= RoomConfig.maxUsers;
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
    this._hostId = userId;

    // Emit the roomUpdated event if the room has more than one user
    this._events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns if the user is the host of the room
   */
  public isHost(userId: RoomUser['userId']): boolean {
    return this._hostId === userId;
  }

  /**
   * Reassigns the host of the room to another user
   */
  public reassignHost(): void {
    // If there are no users left in the room, set the host to null
    if (this._users.length === 0) {
      this._hostId = null;
    }

    // Otherwise, set the host to the first user in the room
    else {
      this._hostId = this._users[0].userId;
    }

    // Emit the roomUpdated event
    this._events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns if a display name is taken
   */
  public isDisplayNameTaken(displayName: RoomUser['displayName']): boolean {
    const name = displayName.toLowerCase();
    return this._users.some(u => u.displayName.toLowerCase() === name);
  }

  /**
   * Returns the room data for the client
   */
  public getClient(userId?: RoomUser['userId']): RoomClient {
    return {
      joinCode: this._joinCode,
      host: this._hostId ?? null,
      users: this._users.map(u =>
        u.getClient({
          isHost: this.isHost(u.userId)
        })
      ),
      isUserInRoom: this._users.some(u => u.userId === userId),
      isUserHost: this.isHost(userId ?? ''),
      game: this._game?.getClient() ?? null
    };
  }

  /**
   * Set the game
   */
  public setGame(game: Game | null): void {
    this._game = game;

    // Emit the roomUpdated event
    this._events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns the current game
   */
  public getGame(): Game | null {
    return this._game;
  }

  /**
   * Set the game options
   */
  public setGameOptions(options: Game['options']): void {
    // If there is no game, do nothing
    if (!this._game) {
      return;
    }

    // Update the game options
    this._game.updateOptions(options);

    // Emit the roomUpdated event
    this._events.emit('roomUpdated', { room: this });
  }

  /**
   * Returns if all room users are online
   */
  public areAllUsersOnline(): boolean {
    return this._users.every(u => u.isOnline);
  }

  /**
   * Starts the game
   */
  public startGame(): void {
    // If there is no game, do nothing
    if (!this._game) {
      return;
    }

    // Start the game
    const players = this._users.map(u => u.userId);
    this._game.start(players);

    // Emit the roomUpdated event
    this._events.emit('roomUpdated', { room: this });
  }
}
