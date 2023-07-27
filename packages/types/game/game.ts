import { GameOptions } from './game-options';
import { GameStatus } from './game-status';
import { GameType } from './game-type';

export interface GameClient<TOptions extends GameOptions> {
  type: GameType;
  status: GameStatus;
  options: TOptions;
}
