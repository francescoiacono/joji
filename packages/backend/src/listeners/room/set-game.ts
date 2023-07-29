import * as yup from 'yup';
import { HandlerOptions } from '..';
import {
  GameStatus,
  GameType,
  RoomClient,
  RoomMessage,
  SocketMessage
} from '@joji/types';
import { Deathroll } from '@/games';
import { schemaIsValid } from '@/utils';

interface Data {
  game: GameType | null;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

const schema: yup.ObjectSchema<Partial<Data>> = yup.object({
  game: yup
    .mixed<GameType>()
    .oneOf(Object.values(GameType))
    .nullable()
    .required()
});

export const setGameHandler = (options: Options) => {
  const { server, session, ack, data } = options;
  const { game } = data;
  const { roomManager } = server;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack({ success: false, error: SocketMessage.ValidationError });
  }

  // Make sure the room exists
  const room = roomManager.getUserRoom(session.user.id);
  if (!room) {
    return ack({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the user is the host
  if (!room.isHost(session.user.id)) {
    return ack({ success: false, error: RoomMessage.NotHost });
  }

  // Make sure the game isn't in progress
  if (room.game && room.game.getStatus() !== GameStatus.Waiting) {
    return ack({ success: false, error: RoomMessage.GameInProgress });
  }

  // Create the game
  switch (game) {
    case null:
      room.setGame(null);
      break;
    case 'deathroll':
      room.setGame(new Deathroll());
      break;
    default:
      return ack({ success: false, error: RoomMessage.GameNotFound });
  }

  // Acknowledge the request
  return ack({ success: true, data: room.getClient(session.user.id) });
};
