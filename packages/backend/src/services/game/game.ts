import { GameClient, GameType } from '@joji/types';
import { GameOptions } from './game-options';

export abstract class Game<T extends GameOptions = GameOptions> {
  abstract type: GameType;
  protected options: T;

  constructor(options: T) {
    this.options = options;
  }

  updateOptions(options: T): void {
    this.options = options;
  }

  abstract start(): void;
  abstract end(): void;

  public getClient(): GameClient {
    return {
      type: this.type
    };
  }
}
