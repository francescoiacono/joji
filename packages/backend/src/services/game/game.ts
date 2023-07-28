import { ObjectSchema } from 'yup';
import { GameClient, GameOptions, GameStatus, GameType } from '@joji/types';

export abstract class Game<TOptions extends GameOptions = GameOptions> {
  abstract type: GameType;
  abstract optionsSchema: ObjectSchema<Partial<TOptions>>;
  abstract options: TOptions;
  protected status: GameStatus = GameStatus.Waiting;

  /**
   * Validates the options for the game
   */
  validateOptions(options: TOptions): boolean {
    try {
      this.optionsSchema.validateSync(options);
      return true;
    } catch (error) {
      return false;
    }
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

  /**
   * Updates the game options
   */
  abstract updateOptions(options: TOptions): void;

  abstract start(): void;
  abstract end(): void;
}
