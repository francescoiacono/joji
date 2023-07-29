import * as yup from 'yup';
import { RoomUser } from '@/services';
import { HandlerOptions } from '..';
import { RoomClient, RoomMessage, SocketMessage } from '@joji/types';
import { schemaIsValid } from '@/utils';

interface Data {
  displayName: RoomUser['displayName'];
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

const schema: yup.ObjectSchema<Partial<Data>> = yup.object({
  displayName: yup.string().required().strict()
});

export const kickUserHandler = (options: Options) => {
  const { server, session, ack, data } = options;
  const { displayName } = data;
  const { roomManager } = server;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack({ success: false, error: SocketMessage.ValidationError });
  }

  // Get the room the user is in
  const room = roomManager.getUserRoom(session.id);

  // If the user is not in a room, return an error
  if (!room) {
    return ack({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the user is the host
  if (!room.isHost(session.id)) {
    return ack({ success: false, error: RoomMessage.NotHost });
  }

  // Find the user to kick
  const user = room.getUserByDisplayName(displayName);

  // If the user is not in the room, return an error
  if (!user) {
    return ack({ success: false, error: RoomMessage.UserNotFound });
  }

  // Make sure the user isn't trying to kick themselves
  if (user.sessionId === session.id) {
    return ack({ success: false, error: RoomMessage.CannotKickSelf });
  }

  // Remove the user from the room
  room.removeUser(user.sessionId);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room.getClient(session.id)
  });
};
