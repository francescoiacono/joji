import { RoomUser } from '../room-user';

export interface Room {
  joinCode: string;
  host: RoomUser;
  users: Array<RoomUser>;
}
