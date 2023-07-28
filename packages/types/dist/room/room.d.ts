import { GameClient, GameOptions } from '../game';
import { RoomUserClient } from '../room-user';
export interface RoomClient {
    joinCode: string;
    users: Array<RoomUserClient>;
    isUserInRoom: boolean;
    isUserHost: boolean;
    game: GameClient<GameOptions> | null;
}
