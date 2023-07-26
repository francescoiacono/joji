import { Room } from '@/services';
import { logger } from '@/utils';
import { HandlerOptions } from '..';

interface Data {
  joinCode: string;
}
type Response = Room | null;
type Options = HandlerOptions<Data, Response>;

export const getRoomByJoinCodeHandler = (options: Options) => {
  const { server, socket, data, ack } = options;
  const { roomManager } = server;

  logger.debug('getRoomByJoinCodeHandler', { socketId: socket.id });

  // Get the room by the join code
  const room = roomManager.getRoom(data.joinCode);

  // Acknowledge the event with the room
  return ack({ success: true, data: room });
};
