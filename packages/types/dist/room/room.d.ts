import { GameClient, GameOptions } from '../game';
import { RoomUserClient } from '../room-user';
export interface RoomClient {
    joinCode: string;
    game: GameClient<GameOptions> | null;
    users: Array<RoomUserClient>;
    isUserInRoom: boolean;
    isUserHost: boolean;
}
