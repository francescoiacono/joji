import { HandlerOptions } from '..';
import { RoomClient, SocketMessage } from '@joji/types';

interface Data {
  joinCode: string;
}
type Response = RoomClient[] | null;
type Options = HandlerOptions<Data, Response>;

export const getRoomsHandler = (options: Options) => {
  const { server, session, ack } = options;
  const { roomManager } = server;

  // Only allow this event in development
  if (process.env.NODE_ENV !== 'development') {
    return ack({
      success: false,
      error: SocketMessage.MethodNotAllowed
    });
  }

  // Get all rooms
  const rooms = roomManager.getRooms();

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: rooms.map(room => room.getClient(session.id))
  });
};
