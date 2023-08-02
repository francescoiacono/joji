import { RoomController } from '../room-controller';
import { Handler } from '@/utils';
import { RoomClient, SocketMessage } from '@joji/types';

type Req = null;
type Res = RoomClient[];
type Controller = RoomController;

export const getRoomsHandler: Handler<Req, Res, Controller> = options => {
  const { ack, controller, session } = options;
  const { roomService } = controller;

  // Only allow this event in development
  if (process.env.NODE_ENV !== 'development') {
    return ack({
      success: false,
      error: SocketMessage.MethodNotAllowed
    });
  }

  // Get the data
  const rooms = roomService.getRooms();

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: rooms.map(room => room.getClient(session.user.id))
  });
};
