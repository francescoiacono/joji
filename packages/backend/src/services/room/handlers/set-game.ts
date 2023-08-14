import * as yup from 'yup';
import { RoomController } from '../room-controller';
import { Handler, schemaIsValid } from '@/utils';
import {
  GameStatus,
  GameType,
  RoomClient,
  RoomMessage,
  SocketMessage
} from '@joji/types';
import { Deathroll } from '@/games';

type Req = {
  game: GameType | null;
};
type Res = RoomClient;
type Controller = RoomController;

const schema: yup.ObjectSchema<Partial<Req>> = yup.object({
  game: yup
    .mixed<GameType>()
    .oneOf(Object.values(GameType))
    .nullable()
    .required()
});

export const setGameHandler: Handler<Req, Res, Controller> = options => {
  const { data, ack, controller, session } = options;
  const { roomService } = controller;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack?.({ success: false, error: SocketMessage.ValidationError });
  }

  // Make sure the room exists
  const room = roomService.getUserRoom(session.user.id);
  if (!room) {
    return ack?.({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the user is the host
  if (!room.isHost(session.user.id)) {
    return ack?.({ success: false, error: RoomMessage.NotHost });
  }

  // Make sure the game isn't in progress
  if (room.game && room.game.getStatus() !== GameStatus.Waiting) {
    return ack?.({ success: false, error: RoomMessage.GameInProgress });
  }

  // Create the game
  switch (data.game) {
    case null:
      room.setGame(null);
      break;
    case 'deathroll':
      room.setGame(new Deathroll());
      break;
    default:
      return ack?.({ success: false, error: RoomMessage.GameNotFound });
  }

  // Acknowledge the request
  return ack?.({ success: true, data: room.getClient(session.user.id) });
};
