import { handler } from '@/utils';
import { GameEvent, RoomEvent } from '@joji/types';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room-service';
import { Session, SessionService } from '../session';
import {
  createRoomHandler,
  getRoomByJoinCodeHandler,
  getRoomsHandler,
  joinRoomHandler,
  kickUserHandler,
  leaveRoomHandler,
  setGameHandler,
  setGameOptionsHandler,
  startGameHandler
} from './handlers';
import { RoomEvents } from './room';
import { GameEvents } from '../game';

export class RoomController {
  private _roomService: RoomService;
  private _io: Server;
  private _sessionService: SessionService;

  constructor(io: Server, sessionService: SessionService) {
    this._roomService = new RoomService();
    this._io = io;
    this._sessionService = sessionService;

    this.setupSessionListeners();
    this.setupClientListeners();
    this.setupRoomListeners();
  }

  /**
   * The `RoomService` instance
   */
  public get roomService(): RoomService {
    return this._roomService;
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
   * Sets up the Client -> Server listeners for the room controller
   */
  private setupClientListeners() {
    const { CreateRoom, GetRoomByJoinCode, GetRooms, JoinRoom } = RoomEvent;
    const { LeaveRoom, KickUser, SetGame, SetGameOptions } = RoomEvent;
    const { StartGame } = RoomEvent;

    this.io.on('connection', socket => {
      const session = this.sessionService.getSessionBySocket(socket);
      const data: [this: RoomController, socket: Socket, session: Session] = [
        this,
        socket,
        session
      ];

      socket.on(CreateRoom, handler(createRoomHandler, ...data));
      socket.on(GetRoomByJoinCode, handler(getRoomByJoinCodeHandler, ...data));
      socket.on(GetRooms, handler(getRoomsHandler, ...data));
      socket.on(JoinRoom, handler(joinRoomHandler, ...data));
      socket.on(LeaveRoom, handler(leaveRoomHandler, ...data));
      socket.on(KickUser, handler(kickUserHandler, ...data));
      socket.on(SetGame, handler(setGameHandler, ...data));
      socket.on(SetGameOptions, handler(setGameOptionsHandler, ...data));
      socket.on(StartGame, handler(startGameHandler, ...data));

      socket.on('disconnect', () => {
        socket.off(CreateRoom, handler(createRoomHandler, ...data));
        socket.off(
          GetRoomByJoinCode,
          handler(getRoomByJoinCodeHandler, ...data)
        );
        socket.off(GetRooms, handler(getRoomsHandler, ...data));
        socket.off(JoinRoom, handler(joinRoomHandler, ...data));
        socket.off(LeaveRoom, handler(leaveRoomHandler, ...data));
        socket.off(KickUser, handler(kickUserHandler, ...data));
        socket.off(SetGame, handler(setGameHandler, ...data));
        socket.off(SetGameOptions, handler(setGameOptionsHandler, ...data));
        socket.off(StartGame, handler(startGameHandler, ...data));
      });
    });
  }

  /**
   * Sets up event listeners from the `SessionService` instance
   */
  public setupSessionListeners() {
    // Remove the user from the room when their session is deleted
    this.sessionService.events.on('sessionDeleted', data => {
      const room = this.roomService.getUserRoom(data.session.user.id);
      room?.removeUser(data.session.user.id);
    });

    // Set the user's online status when their session becomes idle
    this.sessionService.events.on('sessionIdle', data => {
      const room = this.roomService.getUserRoom(data.session.user.id);
      room?.getUser(data.session.user.id)?.setOnlineStatus(false);
    });

    // Set the user's online status when their session becomes active
    this.sessionService.events.on('sessionActive', data => {
      const room = this.roomService.getUserRoom(data.session.user.id);
      room?.getUser(data.session.user.id)?.setOnlineStatus(true);
    });
  }

  /**
   * Sets up event listeners from the `RoomService` instance
   */
  public setupRoomListeners() {
    // Send the updated room to all users in the room
    const onRoomUpdated: RoomEvents['roomUpdated'] = data => {
      data.room.users.forEach(roomUser => {
        const { userId } = roomUser;
        const sessions = this.sessionService.getSessionsByUserId(userId);
        const socketIds = sessions.map(session => session.socketIds).flat();

        this.io
          .to(socketIds)
          .emit(RoomEvent.RoomUpdated, data.room.getClient(userId));

        // Game events
        const onGameStarted: GameEvents['gameStarted'] = data => {
          const client = data.game.getState();
          this.io.to(socketIds).emit(GameEvent.GameStarted, client);
        };
        const onGameUpdated: GameEvents['gameStateUpdated'] = data => {
          const client = data.game.getState();
          this.io.to(socketIds).emit(GameEvent.GameStateUpdated, client);
        };
        const onGameEnded: GameEvents['gameEnded'] = data => {
          const client = data.game.getState();
          this.io.to(socketIds).emit(GameEvent.GameEnded, client);
        };

        data.room.game?.events.on('gameStarted', onGameStarted);
        data.room.game?.events.on('gameStateUpdated', onGameUpdated);
        data.room.game?.events.on('gameEnded', onGameEnded);

        // Remove the game event listeners when the room is updated
        data.room.events.on('roomUpdated', () => {
          data.room.game?.events.off('gameStarted', onGameStarted);
          data.room.game?.events.off('gameStateUpdated', onGameUpdated);
          data.room.game?.events.off('gameEnded', onGameEnded);
        });
      });
    };
    this.roomService.events.on('roomUpdated', onRoomUpdated);
  }
}
