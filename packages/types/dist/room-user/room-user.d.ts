export interface RoomUserClient {
    displayName: string;
    avatarUrl: string | null;
    isHost: boolean;
    isOnline: boolean;
}
