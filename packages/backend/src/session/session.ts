export interface SessionOptions {
  id: string;
  socketId: string;
}

export class Session {
  public id: string;
  public socketId: string;

  constructor(options: SessionOptions) {
    this.id = options.id;
    this.socketId = options.socketId;
  }
}
