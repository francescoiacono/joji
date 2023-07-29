export interface RoomUserClient {
  displayName: string;
  avatar: string | null;
  isHost: boolean;
  isOnline: boolean;
}
