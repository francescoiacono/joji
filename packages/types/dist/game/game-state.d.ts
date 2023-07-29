import { UserClient } from '../user';
interface BaseGameState {
}
export interface DeathrollState extends BaseGameState {
    currentPlayerId: UserClient['id'] | null;
    currentCount: number;
}
export type GameState = DeathrollState;
export {};
