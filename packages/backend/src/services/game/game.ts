import { ObjectSchema } from 'yup';
import {
  GameClient,
  GameOptions,
  GamePlayer,
  GameState,
  GameStatus,
  GameType
} from '@joji/types';
import { EventEmitter } from '../event-emitter';

export type GameEvents = {
  gameStarted: (data: { game: Game }) => void;
  gameStateUpdated: (data: { game: Game }) => void;
  gameEnded: (data: { game: Game }) => void;
};

export abstract class Game<
  TOptions extends GameOptions = GameOptions,
  TState extends GameState = GameState
> {
  public events: EventEmitter<GameEvents>;
  abstract type: GameType;
  abstract optionsSchema: ObjectSchema<Partial<TOptions>>;
  abstract options: TOptions;
  abstract state: TState;
  protected status: GameStatus = GameStatus.Waiting;
  protected players: Array<GamePlayer> = [];

  constructor() {
    this.events = new EventEmitter<GameEvents>();
  }

  /**
   * Validates the provided game options against the schema
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
   * Returns the game state
   */
  public getState(): TState {
    return this.state;
  }

  /**
   * Starts the game
   */
  start(players: Array<GamePlayer>): void {
    this.setStatus(GameStatus.InProgress);
    this.players = players;
  }

  /**
   * Ends the game
   */
  end(): void {
    this.setStatus(GameStatus.Ended);
    this.players = [];
  }

  /**
   * Updates the game options
   */
  abstract updateOptions(options: TOptions): void;

  /**
   * Updates the game state
   */
  abstract updateState(state: TState): void;
}
