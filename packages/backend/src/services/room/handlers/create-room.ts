import * as yup from 'yup';
import { RoomController } from '../room-controller';
import { Handler, schemaIsValid } from '@/utils';
import { RoomClient, SocketMessage } from '@joji/types';
import { validateDisplayName } from '@/validators';

type Req = {
  displayName: string;
  avatar?: string | null;
};
type Res = RoomClient;
type Controller = RoomController;

const schema: yup.ObjectSchema<Partial<Req>> = yup.object({
  displayName: yup.string().required().strict(),
  avatar: yup.string().nullable().strict()
});

export const createRoomHandler: Handler<Req, Res, Controller> = options => {
  const { data, ack, controller, session } = options;
  const { roomService } = controller;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack?.({ success: false, error: SocketMessage.ValidationError });
  }

  // Destructure the data
  const { displayName, avatar } = data;

  // Make sure the display name is valid
  const displayNameError = validateDisplayName(displayName);
  if (displayNameError) {
    return ack?.({ success: false, error: displayNameError });
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

  // Acknowledge the event with the room
  return ack?.({
    success: true,
    data: room.getClient(session.user.id)
  });
};
