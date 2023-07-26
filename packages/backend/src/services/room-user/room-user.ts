import { RoomUser as RoomUserInterface } from '@joji/types';

interface RoomUserOptions {
  sessionId: string;
  displayName: string;
}

export class RoomUser implements RoomUserInterface {
  public sessionId: string;
  public displayName: string;

  constructor(options: RoomUserOptions) {
    this.sessionId = options.sessionId;
    this.displayName = options.displayName;
  }
}
