import { logger } from '@/utils';
import { HandlerOptions } from '..';
import { RoomClient } from '@joji/types';

type Response = RoomClient | null;
type Options = HandlerOptions<null, Response>;

export const leaveRoomHandler = (options: Options) => {
  const { server, socket, session, ack } = options;
  const { roomManager } = server;

  logger.debug('leaveRoomHandler', { socketId: socket.id });

  // Remove the user from the room
  const room = roomManager.removeUserFromRoom(session.id);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room?.getClient(session.id) ?? null
  });
};
