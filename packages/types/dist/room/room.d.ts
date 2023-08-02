import { GameClient, GameOptions } from '../game';
import { RoomUserClient } from '../room-user';
import { UserClient } from '../user';
export interface RoomClient {
    joinCode: string;
    host: UserClient['id'] | null;
    game: GameClient<GameOptions> | null;
    users: Array<RoomUserClient>;
    isUserInRoom: boolean;
    isUserHost: boolean;
}
