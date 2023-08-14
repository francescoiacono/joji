import { Handler } from '@/utils';
import {
  DeathrollState,
  GameMessage,
  GameStatus,
  GameType,
  RoomMessage
} from '@joji/types';
import { GameController } from '../game-controller';

type Req = null;
type Res = DeathrollState | null;
type Controller = GameController;

export const deathrollRollHandler: Handler<Req, Res, Controller> = options => {
  const { ack, controller, session } = options;
  const { roomService } = controller;

  // Get the room the player is in
  const room = roomService.getUserRoom(session.user.id);

  // If the player is not in a room, return
  if (!room) {
    return ack?.({ success: false, error: RoomMessage.NotInRoom });
  }

  // Make sure the game type is deathroll
  if (room.game?.type !== GameType.Deathroll) {
    return ack?.({ success: false, error: GameMessage.WrongGameType });
  }

  // Make sure the game is in progress
  if (room.game?.getStatus() !== GameStatus.InProgress) {
    return ack?.({ success: false, error: GameMessage.GameNotInProgress });
  }

  // Make sure it's the player's turn
  const gameState = room.game.getState();
  if (gameState.currentPlayerId !== session.user.id) {
    return ack?.({ success: false, error: GameMessage.NotYourTurn });
  }

  // Take the turn
  room.game.takeTurn();

  // Acknowledge the request
  ack?.({ success: true, data: room.game.getState() });
};
