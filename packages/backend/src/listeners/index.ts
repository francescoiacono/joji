import { Server, Session } from '@/services';
import { RoomEvent, SocketResponse } from '@joji/types';
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
} from './room';
import { Socket } from 'socket.io';

export interface HandlerOptions<TData, TResponse> {
  server: Server;
  socket: Socket;
  session: Session;
  data: TData;
  ack: (res: SocketResponse<TResponse>) => void;
}

export const listeners = (server: Server, socket: Socket) => {
  const handler = <TData, TResponse>(
    handler: (options: HandlerOptions<TData, TResponse>) => void
  ) => {
    return (data: TData, ack: (res: SocketResponse<TResponse>) => void) => {
      const session = server.sessionService.getSessionBySocket(socket);
      handler({ server, socket, session, data, ack });
    };
  };

  // Room
  socket.on(RoomEvent.GetRooms, handler(getRoomsHandler));
  socket.on(RoomEvent.GetRoomByJoinCode, handler(getRoomByJoinCodeHandler));
  socket.on(RoomEvent.CreateRoom, handler(createRoomHandler));
  socket.on(RoomEvent.LeaveRoom, handler(leaveRoomHandler));
  socket.on(RoomEvent.JoinRoom, handler(joinRoomHandler));
  socket.on(RoomEvent.KickUser, handler(kickUserHandler));
  socket.on(RoomEvent.SetGame, handler(setGameHandler));
  socket.on(RoomEvent.SetGameOptions, handler(setGameOptionsHandler));
  socket.on(RoomEvent.StartGame, handler(startGameHandler));
};
