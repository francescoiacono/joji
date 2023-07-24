import { RoomUser } from '@/room-user';
import { Server } from '@/server';
import { socketError } from '@/utils';
import { RoomConfig } from '@joji/config';
import { RoomEvent, RoomMessage } from '@joji/types';
import { Socket } from 'socket.io';

interface CreateRoomHandlerOptions {
  server: Server;
  socket: Socket;
  data: {
    hostName?: string;
  };
}

export const createRoomHandler = (options: CreateRoomHandlerOptions) => {
  const { server, socket, data } = options;
  const { sessionManager, roomManager } = server;

  // Get the session from the server
  const session = sessionManager.getSession(socket);

  // Make sure the session isn't already in a room
  if (session.roomId) {
    return socketError(socket, RoomMessage.AlreadyInRoom);
  }

  // Make sure the username is valid
  if (!data.hostName?.trim()) {
    return socketError(socket, RoomMessage.UsernameRequired);
  }
  if (data.hostName.length > RoomConfig.username.maxLength) {
    return socketError(socket, RoomMessage.UsernameTooLong);
  }

  // Create a room with the session
  const host = new RoomUser({
    sessionId: session.id,
    displayName: data.hostName
  });
  const room = roomManager.createRoom({ host });

  // Join the room
  session.joinRoom(room.id);

  // Emit the room created event
  socket.emit(RoomEvent.RoomCreated, room);
};
