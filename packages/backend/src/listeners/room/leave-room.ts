import { Room } from '@/services';
import { logger } from '@/utils';
import { HandlerOptions } from '..';

type Response = Room | null;
type Options = HandlerOptions<null, Response>;

export const leaveRoomHandler = (options: Options) => {
  const { server, socket, ack } = options;
  const { sessionManager, roomManager } = server;

  logger.debug('leaveRoomHandler', { socketId: socket.id });

  // Get the session from the server
  const session = sessionManager.getSessionBySocket(socket);

  // Remove the user from the room
  const room = roomManager.removeUserFromRoom(session.id);

  // Acknowledge the event with the room
  return ack({ success: true, data: room });
};
