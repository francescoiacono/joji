import { RoomEvents } from '@/services';
import { RoomClient, RoomEvent } from '@joji/types';
import { validateDisplayName } from '@/validators';
import { HandlerOptions } from '..';

interface Data {
  displayName?: string;
  avatar?: string;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

export const createRoomHandler = (options: Options) => {
  const { server, socket, session, data, ack } = options;
  const { displayName, avatar } = data;
  const { roomManager } = server;

  // Make sure the display name is valid
  const displayNameError = validateDisplayName(displayName);
  if (displayNameError) {
    return ack({ success: false, error: displayNameError });
  }

  // Remove the user from their current room, if they are in one
  roomManager.getUserRoom(session.id)?.removeUser(session.id);

  // Create a room
  const room = roomManager.createRoom();

  // Add the user to the room
  room.addUser({
    sessionId: session.id,
    displayName: displayName!,
    avatarFileName: avatar
  });

  // Set the user as the host
  room.setHost(session.id);

  // Subscribe to room events
  const onRoomUpdated = () => {
    socket.emit(RoomEvent.RoomUpdated, room.getClient(session.id));
  };
  const onUserRemoved: RoomEvents['userRemoved'] = data => {
    if (data.user.sessionId === session.id) {
      room.events.off('roomUpdated', onRoomUpdated);
      room.events.off('userRemoved', onUserRemoved);
    }
  };
  room.events.on('roomUpdated', onRoomUpdated);
  room.events.on('userRemoved', onUserRemoved);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room.getClient(session.id)
  });
};
