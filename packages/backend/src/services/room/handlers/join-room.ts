import * as yup from 'yup';
import { RoomController } from '../room-controller';
import { Handler, schemaIsValid } from '@/utils';
import {
  GameStatus,
  RoomClient,
  RoomMessage,
  SocketMessage
} from '@joji/types';
import { validateDisplayName } from '@/validators';

type Req = {
  roomCode: string;
  displayName: string;
  avatar?: string | null;
};
type Res = RoomClient;
type Controller = RoomController;

const schema: yup.ObjectSchema<Partial<Req>> = yup.object({
  roomCode: yup.string().required().strict(),
  displayName: yup.string().required().strict(),
  avatar: yup.string().nullable().strict()
});

export const joinRoomHandler: Handler<Req, Res, Controller> = options => {
  const { data, ack, controller, session } = options;
  const { roomService } = controller;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack?.({ success: false, error: SocketMessage.ValidationError });
  }

  // Make sure the room exists
  const room = roomService.getRoom(data.roomCode);
  if (!room) {
    return ack?.({ success: false, error: RoomMessage.RoomNotFound });
  }

  // Is the user already in the room?
  if (room.getUser(session.user.id)) {
    return ack?.({ success: false, error: RoomMessage.AlreadyInRoom });
  }

  // Is the game already in progress?
  if (room.game && room.game.getStatus() !== GameStatus.Waiting) {
    return ack?.({ success: false, error: RoomMessage.GameInProgress });
  }

  // Is the room full?
  if (room.isFull()) {
    return ack?.({ success: false, error: RoomMessage.RoomFull });
  }

  // Make sure the display name is not taken
  if (room.isDisplayNameTaken(data.displayName)) {
    return ack?.({ success: false, error: RoomMessage.DisplayNameTaken });
  }

  // Make sure the display name is valid
  const displayNameError = validateDisplayName(data.displayName);
  if (displayNameError) {
    return ack?.({ success: false, error: displayNameError });
  }

  // Remove the user from their current room, if they are in one
  roomService.getUserRoom(session.user.id)?.removeUser(session.user.id);

  // Add the user to the room
  room.addUser({
    userId: session.user.id,
    displayName: data.displayName,
    avatar: data.avatar
  });

  // Acknowledge the request
  ack?.({
    success: true,
    data: room.getClient(session.user.id)
  });
};
