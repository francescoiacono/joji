import * as yup from 'yup';
import { RoomEvents } from '@/services';
import {
  GameStatus,
  RoomClient,
  RoomEvent,
  RoomMessage,
  SocketMessage
} from '@joji/types';
import { validateDisplayName } from '@/validators';
import { HandlerOptions } from '..';
import { schemaIsValid } from '@/utils';

interface Data {
  roomCode: string;
  displayName: string;
  avatar?: string | null;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

const schema: yup.ObjectSchema<Partial<Data>> = yup.object({
  roomCode: yup.string().required().strict(),
  displayName: yup.string().required().strict(),
  avatar: yup.string().nullable().strict()
});

export const joinRoomHandler = (options: Options) => {
  const { server, socket, session, data, ack } = options;
  const { roomManager } = server;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack({ success: false, error: SocketMessage.ValidationError });
  }

  // Make sure the room exists
  const room = roomManager.getRoom(data.roomCode);
  if (!room) {
    return ack({ success: false, error: RoomMessage.RoomNotFound });
  }

  // Is the user already in the room?
  if (room.getUser(session.user.id)) {
    return ack({ success: false, error: RoomMessage.AlreadyInRoom });
  }

  // Is the game already in progress?
  if (room.game && room.game.getStatus() !== GameStatus.Waiting) {
    return ack({ success: false, error: RoomMessage.GameInProgress });
  }

  // Is the room full?
  if (room.isFull()) {
    return ack({ success: false, error: RoomMessage.RoomFull });
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

  // Remove the user from their current room, if they are in one
  roomManager.getUserRoom(session.user.id)?.removeUser(session.user.id);

  // Add the user to the room
  room.addUser({
    userId: session.user.id,
    displayName: data.displayName,
    avatar: data.avatar
  });

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

  // Acknowledge the request
  ack({
    success: true,
    data: room.getClient(session.user.id)
  });
};
