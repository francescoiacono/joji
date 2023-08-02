import { RoomController } from '../room-controller';
import { Handler } from '@/utils';
import { RoomClient } from '@joji/types';

type Req = null;
type Res = RoomClient | null;
type Controller = RoomController;

export const leaveRoomHandler: Handler<Req, Res, Controller> = options => {
  const { ack, controller, session } = options;
  const { roomService } = controller;

  // Remove the user from the room
  roomService.getUserRoom(session.user.id)?.removeUser(session.user.id);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: null
  });
};
