import { GameClient, GameOptions, GameStatus, GameType } from '@joji/types';

export abstract class Game<TOptions extends GameOptions = GameOptions> {
  abstract type: GameType;
  protected options: TOptions;
  protected status: GameStatus = GameStatus.Waiting;

  constructor(options: TOptions) {
    this.options = options;
  }

  /**
   * Updates the game options
   */
  updateOptions(options: TOptions): void {
    this.options = options;
  }

  /**
   * Returns the current status of the game
   */
  getStatus(): GameStatus {
    return this.status;
  }

  /**
   * Sets the status of the game
   */
  setStatus(status: GameStatus): void {
    this.status = status;
  }

  /**
   * Returns the game object, formatted for the client
   */
  public getClient(): GameClient<TOptions> {
    return {
      type: this.type,
      status: this.status,
      options: this.options
    };
  }

  abstract start(): void;
  abstract end(): void;
}
