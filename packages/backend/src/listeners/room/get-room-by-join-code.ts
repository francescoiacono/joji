import { Socket } from 'socket.io';
import { Server } from '@/services';
import { logger } from '@/utils';
import { RoomEvent } from '@joji/types';

interface GetRoomByJoinCodeHandlerOptions {
  server: Server;
  socket: Socket;
  data: {
    joinCode: string;
  };
}

export const getRoomByJoinCodeHandler = (
  options: GetRoomByJoinCodeHandlerOptions
) => {
  const { server, socket, data } = options;
  const { roomManager } = server;

  logger.debug('getRoomByJoinCodeHandler', { socketId: socket.id });

  // Get the room by the join code
  const room = roomManager.getRoom(data.joinCode);

  // Emit the room event
  socket.emit(RoomEvent.Room, room);
};
