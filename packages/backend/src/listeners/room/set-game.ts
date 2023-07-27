import { HandlerOptions } from '..';
import { GameType, RoomClient, RoomMessage } from '@joji/types';
import { Deathroll } from '@/games';

interface Data {
  game: GameType | null;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

export const setGameHandler = (options: Options) => {
  const { server, session, ack, data } = options;
  const { game } = data;
  const { roomManager } = server;

  // Make sure the room exists
  const room = roomManager.getUserRoom(session.id);
  if (!room) {
    return ack({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the user is the host
  if (!room.isHost(session.id)) {
    return ack({ success: false, error: RoomMessage.NotHost });
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
  return ack({ success: true, data: room.getClient(session.id) });
};
