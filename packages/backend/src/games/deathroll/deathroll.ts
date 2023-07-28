import * as yup from 'yup';
import { Game } from '@/services';
import { DeathrollOptions, GameType } from '@joji/types';

export class Deathroll extends Game<DeathrollOptions> {
  type = GameType.Deathroll;
  options = {
    startingValue: 100
  };
  optionsSchema = yup.object({
    startingValue: yup.number().min(1)
  });

  updateOptions(options: DeathrollOptions): void {
    this.options = {
      ...this.options,
      startingValue: options.startingValue || this.options.startingValue
    };
  }

  start() {}

  end() {}
}
