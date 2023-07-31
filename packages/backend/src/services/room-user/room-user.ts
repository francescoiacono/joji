import { RoomUserClient } from '@joji/types';
import { EventEmitter } from '../event-emitter';
import { User } from '../user';

export type RoomUserEvents = {
  roomUserUpdated: (data: { roomUser: RoomUser }) => void;
};

export interface RoomUserOptions {
  userId: User['id'];
  displayName: string;
  avatar?: string | null;
}

interface GetClientOptions {
  isHost: boolean;
}

export class RoomUser {
  private _events: EventEmitter<RoomUserEvents>;
  private _userId: User['id'];
  private _displayName: string;
  private _avatar: string | null;
  private _isOnline: boolean = true;

  constructor(options: RoomUserOptions) {
    this._events = new EventEmitter<RoomUserEvents>();
    this._userId = options.userId;
    this._displayName = options.displayName;
    this._avatar = options.avatar || null;
  }

  /**
   * Returns the `RoomUserEvents` event emitter
   */
  public get events(): EventEmitter<RoomUserEvents> {
    return this._events;
  }

  /**
   * Returns the user ID
   */
  public get userId(): User['id'] {
    return this._userId;
  }

  /**
   * Returns the display name
   */
  public get displayName(): string {
    return this._displayName;
  }

  /**
   * Returns the avatar
   */
  public get avatar(): string | null {
    return this._avatar;
  }

  /**
   * Returns whether the user is online
   */
  public get isOnline(): boolean {
    return this._isOnline;
  }

  /**
   * Set the user's online status
   */
  public setOnlineStatus(isOnline: boolean): void {
    this._isOnline = isOnline;
    this._events.emit('roomUserUpdated', { roomUser: this });
  }

  /**
   * Returns a RoomUserClient
   */
  public getClient(options: GetClientOptions): RoomUserClient {
    return {
      displayName: this._displayName,
      avatar: this._avatar,
      isOnline: this._isOnline,
      isHost: options.isHost,
      userId: this._userId
    };
  }
}
