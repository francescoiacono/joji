interface RoomUserOptions {
  sessionId: string;
  displayName: string;
}

export class RoomUser {
  public sessionId: string;
  public displayName: string;

  constructor(options: RoomUserOptions) {
    this.sessionId = options.sessionId;
    this.displayName = options.displayName;
  }
}
