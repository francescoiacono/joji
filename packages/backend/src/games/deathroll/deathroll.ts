import { Game } from '@/services';
import { DeathrollOptions, GameType } from '@joji/types';

export class Deathroll extends Game<DeathrollOptions> {
  type: GameType = GameType.Deathroll;
  private startingValue: number;

  constructor(options?: DeathrollOptions) {
    super(
      options || {
        startingValue: 100
      }
    );
    this.startingValue = options?.startingValue || 100;
  }

  updateOptions(options: DeathrollOptions): void {
    super.updateOptions(options);
    this.startingValue = options.startingValue || this.startingValue;
  }

  start() {}

  end() {}
}
