import { HandlerOptions } from '..';
import { RoomClient, SocketMessage } from '@joji/types';

type Response = RoomClient[] | null;
type Options = HandlerOptions<null, Response>;

export const getRoomsHandler = (options: Options) => {
  const { server, session, ack } = options;
  const { roomService } = server;

  // Only allow this event in development
  if (process.env.NODE_ENV !== 'development') {
    return ack({
      success: false,
      error: SocketMessage.MethodNotAllowed
    });
  }

  // Get all rooms
  const rooms = roomService.getRooms();

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: rooms.map(room => room.getClient(session.user.id))
  });
};
