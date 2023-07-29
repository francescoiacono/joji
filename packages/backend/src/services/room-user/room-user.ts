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
  public events: EventEmitter<RoomUserEvents>;
  public userId: User['id'];
  public displayName: string;
  public avatar: string | null;
  public isOnline: boolean = true;

  constructor(options: RoomUserOptions) {
    this.events = new EventEmitter<RoomUserEvents>();
    this.userId = options.userId;
    this.displayName = options.displayName;
    this.avatar = options.avatar || null;
  }

  /**
   * Set the user's online status
   */
  public setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    this.events.emit('roomUserUpdated', { roomUser: this });
  }

  /**
   * Returns a RoomUserClient
   */
  public getClient(options: GetClientOptions): RoomUserClient {
    return {
      displayName: this.displayName,
      avatar: this.avatar,
      isOnline: this.isOnline,
      isHost: options.isHost,
      userId: this.userId
    };
  }
}
