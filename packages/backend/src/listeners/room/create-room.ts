import { RoomUser } from '@/services';
import { logger } from '@/utils';
import { RoomClient, RoomMessage } from '@joji/types';
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

  // Make sure the session isn't already in a room
  if (roomManager.getUserRoom(session.id)) {
    return ack({ success: false, error: RoomMessage.AlreadyInRoom });
  }

  // Make sure the display name is valid
  const displayNameError = validateDisplayName(data.displayName);
  if (displayNameError) {
    return ack({ success: false, error: displayNameError });
  }

  // Create a room with the session
  // This will also add the session to the room
  const host = new RoomUser({
    sessionId: session.id,
    displayName: data.displayName!
  });
  const room = roomManager.createRoom(host);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room.getClient(session.id)
  });
};
