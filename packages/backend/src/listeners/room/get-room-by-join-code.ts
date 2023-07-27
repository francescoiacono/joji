import { HandlerOptions } from '..';
import { RoomClient } from '@joji/types';

interface Data {
  joinCode: string;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

export const getRoomByJoinCodeHandler = (options: Options) => {
  const { server, session, data, ack } = options;
  const { roomManager } = server;

  // Get the room by the join code
  const room = roomManager.getRoom(data.joinCode);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room?.getClient(session.id) ?? null
  });
};
