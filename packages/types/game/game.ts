import { GameStatus } from './game-status';
import { GameType } from './game-type';

export interface GameClient {
  type: GameType;
  status: GameStatus;
}
