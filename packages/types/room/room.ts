import { RoomUserClient } from '../room-user';

export interface RoomClient {
  joinCode: string;
  host: RoomUserClient;
  users: Array<RoomUserClient>;
  isUserInRoom: boolean;
}
