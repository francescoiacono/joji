import { RoomEvent } from '@joji/types';
import { Socket } from 'socket.io';
import {
  createRoomHandler,
  getRoomByJoinCodeHandler,
  getRoomHandler,
  leaveRoomHandler
} from './room';
import { Server } from '@/services';

export const listeners = (server: Server, socket: Socket) => {
  // Room
  socket.on(RoomEvent.GetRoom, () => {
    return getRoomHandler({ server, socket });
  });
  socket.on(RoomEvent.GetRoomByJoinCode, data => {
    return getRoomByJoinCodeHandler({ server, socket, data });
  });
  socket.on(RoomEvent.CreateRoom, data => {
    return createRoomHandler({ server, socket, data });
  });
  socket.on(RoomEvent.LeaveRoom, () => {
    return leaveRoomHandler({ server, socket });
  });
};
