import { Room } from '@/room';
import { Socket } from 'socket.io';

export interface SessionOptions {
  id: string;
  socketId: string;
}

export class Session {
  public id: string;
  public socketId: Socket['id'];
  public roomId?: Room['id'];

  constructor(options: SessionOptions) {
    this.id = options.id;
    this.socketId = options.socketId;
  }

  /**
   * Marks the session as being in the given room
   */
  public joinRoom(roomId: Room['id']): void {
    this.roomId = roomId;
  }

  /**
   * Unmarks the session as being in a room
   */
  public leaveRoom(): void {
    this.roomId = undefined;
  }
}
