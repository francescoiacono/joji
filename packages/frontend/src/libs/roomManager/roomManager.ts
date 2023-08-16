import {
  GameEvent,
  GameOptions,
  GameState,
  GameType,
  RoomClient,
  RoomEvent,
  SocketResponse
} from '@joji/types';
import { Socket } from 'socket.io-client';
import { EventEmitter } from '../eventEmitter';

class RoomManager {
  private static instance: RoomManager;
  private socket: Socket;
  private room: RoomClient | null = null;
  private gameState: GameState | null = null;
  private eventEmitter = new EventEmitter();

  private constructor(socket: Socket) {
    this.socket = socket;
    this.listenForRoomUpdates();
    this.listenForGameUpdates();
  }

  /**
   * This is a singleton class. Use this to get the instance of the class.
   */
  static getInstance(socket: Socket): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager(socket);
    } else if (RoomManager.instance.socket !== socket) {
      throw new Error('Cannot initialize RoomManager with a different socket');
    }
    return RoomManager.instance;
  }

  /**
   * Returns the current room.
   */
  get currentRoom() {
    return this.room;
  }

  /**
   * Returns the current game state.
   */
  get currentGameState() {
    return this.gameState;
  }

  /**
   * This function emits a get room by join code event to the server.
   */
  getRoomByJoinCode(joinCode: string) {
    return this.socket.emit(
      RoomEvent.GetRoomByJoinCode,
      { joinCode },
      (room: RoomClient) => {
        this.room = room;
      }
    );
  }

  /**
   * This function is used to subscribe to room updates.
   */
  on(eventName: string, callback: Function) {
    this.eventEmitter.addListener(eventName, callback);
  }

  /**
   * This function is used to unsubscribe to room updates.
   */
  off(eventName: string, callback: Function) {
    this.eventEmitter.removeListener(eventName, callback);
  }

  /**
   * This function emits a create room event to the server.
   */
  createRoom(displayName: string, avatar: string) {
    this.socket.emit(
      RoomEvent.CreateRoom,
      { displayName, avatar },
      (room: RoomClient) => {
        this.room = room;
      }
    );
  }

  /**
   * This function emits a jooin room event to the server.
   */
  joinRoom(roomCode: string, displayName: string) {
    this.socket.emit(
      RoomEvent.JoinRoom,
      {
        roomCode,
        displayName,
        avatar: '1.png'
      },
      (room: RoomClient) => {
        this.room = room;
      }
    );
  }

  /**
   * This function emits a leave room event to the server.
   */
  leaveRoom() {
    this.socket.emit(RoomEvent.LeaveRoom, null, () => {});
    this.room = null;
    this.eventEmitter.emit(RoomEvent.RoomUpdated, this.room);
    this.eventEmitter.removeListener(RoomEvent.RoomUpdated, () => {});
    this.socket.off(RoomEvent.RoomUpdated);
  }

  /**
   * This function emits a set room event to the server.
   */
  setGame(game: GameType) {
    this.socket.emit(RoomEvent.SetGame, { game }, (room: RoomClient) => {
      this.room = room;
    });
  }

  /**
   * This function emits a set game event to the server.
   */
  setGameOptions(options: GameOptions) {
    this.socket.emit(
      RoomEvent.SetGameOptions,
      options,
      (res: SocketResponse<RoomClient>) => {
        if (res.success) {
          this.room = res.data;
        }
      }
    );
  }

  /**
   * This function emits a set game event to the server.
   */

  startGame() {
    this.socket.emit(
      RoomEvent.StartGame,
      null,
      (res: SocketResponse<GameState>) => {
        if (res.success) {
          this.gameState = res.data;
        }
      }
    );
  }

  /**
   * This function emits a set game event to the server.
   */
  private listenForRoomUpdates() {
    this.socket.on(RoomEvent.RoomUpdated, (room: RoomClient) => {
      this.room = room;
      this.eventEmitter.emit(RoomEvent.RoomUpdated, room);
    });
  }

  private listenForGameUpdates() {
    this.socket.on(GameEvent.GameStateUpdated, (game: GameState) => {
      this.gameState = game;
      this.eventEmitter.emit(GameEvent.GameStateUpdated, game);
    });
  }
}

export default RoomManager;
