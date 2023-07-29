import { RoomUserClient } from '@joji/types';
import { EventEmitter } from '../event-emitter';

export type RoomUserEvents = {
  roomUserUpdated: (data: { roomUser: RoomUser }) => void;
};

export interface RoomUserOptions {
  sessionId: string;
  displayName: string;
  avatarFileName?: string | null;
}

interface GetClientOptions {
  isHost: boolean;
}

export class RoomUser {
  public events: EventEmitter<RoomUserEvents>;
  public sessionId: string;
  public displayName: string;
  public avatarFileName: string | null;
  public isOnline: boolean = true;

  constructor(options: RoomUserOptions) {
    this.events = new EventEmitter<RoomUserEvents>();
    this.sessionId = options.sessionId;
    this.displayName = options.displayName;
    this.avatarFileName = options.avatarFileName || null;
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
      avatarUrl: this.getAvatarUrl(),
      isOnline: this.isOnline,
      isHost: options.isHost
    };
  }

  /**
   * Gets the user's avatar URL
   */
  public getAvatarUrl(): string | null {
    // If there is no avatar path, return null
    if (!this.avatarFileName) {
      return null;
    }

    // Construct the avatar URL
    return `${process.env.AVATAR_URL}/${this.avatarFileName}`;
  }
}
