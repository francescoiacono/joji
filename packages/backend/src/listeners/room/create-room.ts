import { RoomUser } from '@/services';
import { logger } from '@/utils';
import { RoomClient } from '@joji/types';
import { validateDisplayName } from '@/validators';
import { HandlerOptions } from '..';

interface Data {
  displayName?: string;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

export const createRoomHandler = (options: Options) => {
  const { server, socket, data, ack } = options;
  const { sessionManager, roomManager } = server;

  logger.debug('createRoomHandler', { socketId: socket.id });

  // Get the session from the server
  const session = sessionManager.getSessionBySocket(socket);

  // Make sure the display name is valid
  const displayNameError = validateDisplayName(data.displayName);
  if (displayNameError) {
    return ack({ success: false, error: displayNameError });
  }

  // Remove the user from their current room, if they are in one
  roomManager.removeUserFromRoom(session.id);

  // Create a room
  const room = roomManager.createRoom();

  // Add the user to the room
  const host = new RoomUser({
    sessionId: session.id,
    displayName: data.displayName!
  });
  roomManager.addUserToRoom(host, room.joinCode);

  // Set the host of the room
  room.setHost(host);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room.getClient(session.id)
  });
};
