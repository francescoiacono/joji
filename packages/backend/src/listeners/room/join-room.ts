import { RoomUser } from '@/services';
import { logger } from '@/utils';
import { RoomClient, RoomEvent, RoomMessage, SocketMessage } from '@joji/types';
import { validateDisplayName } from '@/validators';
import { HandlerOptions } from '..';

interface Data {
  roomCode?: string;
  displayName?: string;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

export const joinRoomHandler = (options: Options) => {
  const { server, socket, session, data, ack } = options;
  const { roomManager } = server;

  logger.debug('joinRoomHandler', { socketId: socket.id });

  // Make sure all the data is present
  if (!data.roomCode || !data.displayName) {
    return ack({ success: false, error: SocketMessage.MissingData });
  }

  // Make sure the session isn't already in a room
  if (roomManager.getUserRoom(session.id)) {
    return ack({ success: false, error: RoomMessage.AlreadyInRoom });
  }

  // Make sure the room exists
  const room = roomManager.getRoom(data.roomCode);
  if (!room) {
    return ack({ success: false, error: RoomMessage.RoomNotFound });
  }

  // Make sure the display name is not taken
  if (room.isDisplayNameTaken(data.displayName)) {
    return ack({ success: false, error: RoomMessage.DisplayNameTaken });
  }

  // Make sure the display name is valid
  const displayNameError = validateDisplayName(data.displayName);
  if (displayNameError) {
    return ack({ success: false, error: displayNameError });
  }

  // Create the user
  const user = new RoomUser({
    sessionId: session.id,
    displayName: data.displayName
  });

  // Add the user to the room
  roomManager.addUserToRoom({ user, joinCode: room.joinCode });

  // Send an update to the room
  server.io.to(room.joinCode).emit(RoomEvent.RoomUpdated, room);

  // Acknowledge the request
  ack({
    success: true,
    data: room.getClient(session.id)
  });
};
