import { UserClient } from '../user';

export interface RoomUserClient {
  userId: UserClient['id'];
  displayName: string;
  avatar: string | null;
  isHost: boolean;
  isOnline: boolean;
}
