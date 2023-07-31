import * as yup from 'yup';
import { RoomEvents } from '@/services';
import { RoomClient, RoomEvent, SocketMessage } from '@joji/types';
import { validateDisplayName } from '@/validators';
import { HandlerOptions } from '..';
import { schemaIsValid } from '@/utils';

interface Data {
  displayName: string;
  avatar?: string | null;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

const schema: yup.ObjectSchema<Partial<Data>> = yup.object({
  displayName: yup.string().required().strict(),
  avatar: yup.string().nullable().strict()
});

export const createRoomHandler = (options: Options) => {
  const { server, socket, session, data, ack } = options;
  const { displayName, avatar } = data;
  const { roomService } = server;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack({ success: false, error: SocketMessage.ValidationError });
  }

  // Make sure the display name is valid
  const displayNameError = validateDisplayName(displayName);
  if (displayNameError) {
    return ack({ success: false, error: displayNameError });
  }

  // Remove the user from their current room, if they are in one
  roomService.getUserRoom(session.user.id)?.removeUser(session.user.id);

  // Create a room
  const room = roomService.createRoom();

  // Add the user to the room
  room.addUser({
    userId: session.user.id,
    displayName: displayName!,
    avatar
  });

  // Set the user as the host
  room.setHost(session.user.id);

  // Subscribe to room events
  const onRoomUpdated = () => {
    socket.emit(RoomEvent.RoomUpdated, room.getClient(session.user.id));
  };
  const onUserRemoved: RoomEvents['userRemoved'] = data => {
    const { roomUser } = data;
    if (roomUser.userId === session.user.id) {
      room.events.off('roomUpdated', onRoomUpdated);
      room.events.off('userRemoved', onUserRemoved);
    }
  };
  room.events.on('roomUpdated', onRoomUpdated);
  room.events.on('userRemoved', onUserRemoved);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room.getClient(session.user.id)
  });
};
