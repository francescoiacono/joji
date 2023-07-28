import { RoomUserClient } from '@joji/types';
import { EventEmitter } from '../event-emitter';

export type RoomUserEvents = {
  roomUserUpdated: (data: { roomUser: RoomUser }) => void;
};

interface GetClientOptions {
  isHost: boolean;
}

interface RoomUserOptions {
  sessionId: string;
  displayName: string;
}

export class RoomUser {
  public events: EventEmitter<RoomUserEvents>;
  public sessionId: string;
  public displayName: string;
  public isOnline: boolean = true;

  constructor(options: RoomUserOptions) {
    this.events = new EventEmitter<RoomUserEvents>();
    this.sessionId = options.sessionId;
    this.displayName = options.displayName;
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
      isOnline: this.isOnline,
      isHost: options.isHost
    };
  }
}
