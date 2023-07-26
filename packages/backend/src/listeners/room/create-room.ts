import { RoomUser, Room } from '@/services';
import { logger } from '@/utils';
import { RoomConfig } from '@joji/config';
import { RoomMessage } from '@joji/types';
import { HandlerOptions } from '..';

interface Data {
  hostName?: string;
}
type Response = Room | null;
type Options = HandlerOptions<Data, Response>;

export const createRoomHandler = (options: Options) => {
  const { server, socket, data, ack } = options;
  const { sessionManager, roomManager } = server;

  logger.debug('createRoomHandler', { socketId: socket.id });

  // Get the session from the server
  const session = sessionManager.getSession(socket);

  // Make sure the session isn't already in a room
  if (roomManager.getUserRoom(session.id)) {
    return ack({ success: false, error: RoomMessage.AlreadyInRoom });
  }

  // Make sure the username is valid
  if (!data.hostName?.trim()) {
    return ack({ success: false, error: RoomMessage.UsernameRequired });
  }
  if (data.hostName.length > RoomConfig.username.maxLength) {
    return ack({ success: false, error: RoomMessage.UsernameTooLong });
  }

  // Create a room with the session
  // This will also add the session to the room
  const host = new RoomUser({
    sessionId: session.id,
    displayName: data.hostName
  });
  const room = roomManager.createRoom({ host });

  // Acknowledge the event with the room
  return ack({ success: true, data: room });
};
