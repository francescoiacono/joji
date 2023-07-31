import { GameState, GameStatus, RoomMessage } from '@joji/types';
import { HandlerOptions } from '..';

type Response = GameState | null;
type Options = HandlerOptions<null, Response>;

export const startGameHandler = (options: Options) => {
  const { server, session, ack } = options;
  const { roomManager } = server;

  // Get the room the user is in
  const room = roomManager.getUserRoom(session.user.id);
  if (!room) {
    return ack({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the user is in the room
  if (!room.getUser(session.user.id)) {
    return ack({ success: false, error: RoomMessage.UserNotFound });
  }

  // Make sure the user is the host
  if (!room.isHost(session.user.id)) {
    return ack({ success: false, error: RoomMessage.NotHost });
  }

  // Make sure a game has been selected
  if (!room.game) {
    return ack({ success: false, error: RoomMessage.NoGameSelected });
  }

  // Make sure the game is not already started
  if (room.game.getStatus() === GameStatus.InProgress) {
    return ack({ success: false, error: RoomMessage.GameInProgress });
  }

  // Make sure all users are online
  if (!room.areAllUsersOnline()) {
    return ack({ success: false, error: RoomMessage.NotAllUsersReady });
  }

  // Start the game
  room.startGame();

  // Acknowledge the request
  ack({ success: true, data: room.game.getState() });
};
