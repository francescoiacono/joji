import { GameType } from '@joji/types';
import { Game } from '@/services';
import { DeathrollOptions } from './deathroll-options';

export class Deathroll extends Game<DeathrollOptions> {
  type: GameType = 'deathroll';
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
