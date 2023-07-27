import { RoomUserClient } from '../room-user';
export interface RoomClient {
    joinCode: string;
    host: RoomUserClient | null;
    users: Array<RoomUserClient>;
    isUserInRoom: boolean;
}
