import { Server, Socket } from 'socket.io';
import { Session, SessionService } from '../session';
import { RoomService } from '../room';
import { GameEvent } from '@joji/types';
import { deathrollRollHandler } from './handlers';
import { handler } from '@/utils';

export class GameController {
  private _io: Server;
  private _sessionService: SessionService;
  private _roomService: RoomService;

  constructor(
    io: Server,
    sessionService: SessionService,
    roomService: RoomService
  ) {
    this._io = io;
    this._sessionService = sessionService;
    this._roomService = roomService;

    this.setupClientListeners();
  }

  /**
   * The socket.io server
   */
  public get io(): Server {
    return this._io;
  }

  /**
   * The `SessionService` instance
   */
  public get sessionService(): SessionService {
    return this._sessionService;
  }

  /**
   * The `RoomService` instance
   */
  public get roomService(): RoomService {
    return this._roomService;
  }

  /**
   * Sets up the Client -> Server listeners for the game controller
   */
  private setupClientListeners() {
    const { DeathrollRoll } = GameEvent;

    this.io.on('connection', socket => {
      const session = this.sessionService.getSessionBySocket(socket);
      const data: [this: GameController, socket: Socket, session: Session] = [
        this,
        socket,
        session
      ];

      socket.on(DeathrollRoll, handler(deathrollRollHandler, ...data));

      socket.on('disconnect', () => {
        socket.off(DeathrollRoll, handler(deathrollRollHandler, ...data));
      });
    });
  }
}
