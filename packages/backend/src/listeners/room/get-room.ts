import { Socket } from 'socket.io';
import { Server } from '@/services';
import { logger } from '@/utils';
import { RoomEvent } from '@joji/types';

interface GetRoomHandlerOptions {
  server: Server;
  socket: Socket;
}

export const getRoomHandler = (options: GetRoomHandlerOptions) => {
  const { server, socket } = options;
  const { sessionManager, roomManager } = server;

  logger.debug('getRoomHandler', { socketId: socket.id });

  // Get the session from the server
  const session = sessionManager.getSession(socket);

  // Get the room the user is in
  const room = roomManager.getUserRoom(session.id);

  // Emit the room event
  socket.emit(RoomEvent.Room, room);
};
