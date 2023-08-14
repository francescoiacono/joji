import * as yup from 'yup';
import { RoomController } from '../room-controller';
import { Handler, schemaIsValid } from '@/utils';
import { RoomClient, RoomMessage, SocketMessage } from '@joji/types';
import { RoomUser } from '@/services/room-user';

type Req = {
  userId: RoomUser['userId'];
};
type Res = RoomClient;
type Controller = RoomController;

const schema: yup.ObjectSchema<Partial<Req>> = yup.object({
  userId: yup.string().required().strict()
});

export const kickUserHandler: Handler<Req, Res, Controller> = options => {
  const { data, ack, controller, session } = options;
  const { roomService } = controller;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack?.({ success: false, error: SocketMessage.ValidationError });
  }

  // Get the room the user is in
  const room = roomService.getUserRoom(session.user.id);

  // If the user is not in a room, return an error
  if (!room) {
    return ack?.({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the user is the host
  if (!room.isHost(session.user.id)) {
    return ack?.({ success: false, error: RoomMessage.NotHost });
  }

  // Find the user to kick
  const user = room.getUser(data.userId);

  // If the user is not in the room, return an error
  if (!user) {
    return ack?.({ success: false, error: RoomMessage.UserNotFound });
  }

  // Make sure the user isn't trying to kick themselves
  if (user.userId === session.user.id) {
    return ack?.({ success: false, error: RoomMessage.CannotKickSelf });
  }

  // Remove the user from the room
  room.removeUser(user.userId);

  // Acknowledge the event with the room
  return ack?.({
    success: true,
    data: room.getClient(session.user.id)
  });
};
