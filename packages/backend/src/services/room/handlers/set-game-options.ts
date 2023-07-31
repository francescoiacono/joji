import { RoomController } from '../room-controller';
import { Handler } from '@/utils';
import { GameOptions, GameStatus, RoomClient, RoomMessage } from '@joji/types';

type Req = GameOptions;
type Res = RoomClient;
type Controller = RoomController;

export const setGameOptionsHandler: Handler<Req, Res, Controller> = options => {
  const { data, ack, controller, session } = options;
  const { roomService } = controller;

  // Make sure the room exists
  const room = roomService.getUserRoom(session.user.id);
  if (!room) {
    return ack({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the user is the host
  if (!room.isHost(session.user.id)) {
    return ack({ success: false, error: RoomMessage.NotHost });
  }

  // Make sure a game is set
  if (!room.game) {
    return ack({ success: false, error: RoomMessage.NoGameSelected });
  }

  // Make sure the game isn't in progress
  if (room.game.getStatus() !== GameStatus.Waiting) {
    return ack({ success: false, error: RoomMessage.GameInProgress });
  }

  // Make sure the game options are valid
  if (!room.game.validateOptions(data)) {
    return ack({ success: false, error: RoomMessage.InvalidGameOptions });
  }

  // Update the game options
  room.game.updateOptions(data);

  // Acknowledge the request
  return ack({ success: true, data: room.getClient(session.user.id) });
};
