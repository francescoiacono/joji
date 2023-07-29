import * as yup from 'yup';
import { Game } from '@/services';
import {
  DeathrollOptions,
  DeathrollState,
  GamePlayer,
  GameType
} from '@joji/types';

export class Deathroll extends Game<DeathrollOptions, DeathrollState> {
  type = GameType.Deathroll;
  options = {
    startingValue: 100
  };
  optionsSchema = yup.object({
    startingValue: yup.number().min(1)
  });
  state: DeathrollState = {
    currentCount: 0,
    currentPlayerId: null
  };

  private currentPlayerIndex: number = 0;

  updateOptions(options: DeathrollOptions): void {
    this.options = {
      ...this.options,
      startingValue: options.startingValue || this.options.startingValue
    };
  }

  updateState(state: DeathrollState): void {
    this.state = {
      ...this.state,
      currentCount: state.currentCount || this.state.currentCount,
      currentPlayerId: state.currentPlayerId || this.state.currentPlayerId
    };
  }

  start(players: Array<GamePlayer>): void {
    super.start(players);

    this.updateState({
      currentCount: this.options.startingValue,
      currentPlayerId: this.players[0]
    });
  }

  takeTurn(): void {
    const { currentCount } = this.state;

    // Decrease the count by a random number
    const randomNum = Math.floor(Math.random() * currentCount);
    const newCount = currentCount - randomNum;

    // If the count is 1, end the game
    if (newCount === 1) {
      this.end();
      return;
    }

    // Go to the next player's turn
    const nextPlayer = (this.currentPlayerIndex + 1) % this.players.length;

    // Update the state
    this.updateState({
      currentCount: newCount,
      currentPlayerId: this.players[nextPlayer]
    });
  }

  end() {
    super.end();
  }
}
