import { GameOptions, GameType, RoomClient, RoomEvent } from '@joji/types';
import { Socket } from 'socket.io-client';
import { EventEmitter } from '../eventEmitter';

class RoomManager {
  private static instance: RoomManager;
  private room: RoomClient | null = null;
  private socket: Socket;
  private eventEmitter = new EventEmitter();

  private constructor(socket: Socket) {
    this.socket = socket;
    this.listenForRoomUpdates();
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
    console.log('subscribing to room updates');
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
    console.log('displayName', displayName);
    console.log('roomCode', roomCode);

    this.socket.emit(
      RoomEvent.JoinRoom,
      {
        roomCode,
        displayName,
        avatar: '1.png'
      },
      (room: RoomClient) => {
        console.log('room', room);
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
      { options },
      (room: RoomClient) => {
        this.room = room;
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
}

export default RoomManager;
