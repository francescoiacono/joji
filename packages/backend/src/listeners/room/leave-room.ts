import { Socket } from 'socket.io';
import { Server } from '@/services';
import { RoomEvent } from '@joji/types';
import { logger } from '@/utils';

interface LeaveRoomHandlerOptions {
  server: Server;
  socket: Socket;
}

export const leaveRoomHandler = (options: LeaveRoomHandlerOptions) => {
  const { server, socket } = options;
  const { sessionManager, roomManager } = server;

  logger.debug('leaveRoomHandler', { socketId: socket.id });

  // Get the session from the server
  const session = sessionManager.getSession(socket);

  // Remove the user from the room
  const room = roomManager.removeUserFromRoom(session.id);

  // Emit the room created event
  socket.emit(RoomEvent.RoomLeft, room);
};
