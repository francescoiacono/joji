interface BaseGameOptions {}
export interface DeathrollOptions extends BaseGameOptions {
  startingValue: number;
}
export type GameOptions = DeathrollOptions;
export {};
