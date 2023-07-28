import { HandlerOptions } from '..';
import { RoomClient } from '@joji/types';

type Response = RoomClient | null;
type Options = HandlerOptions<null, Response>;

export const leaveRoomHandler = (options: Options) => {
  const { server, session, ack } = options;
  const { roomManager } = server;

  // Remove the user from the room
  roomManager.getUserRoom(session.id)?.removeUser(session.id);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: null
  });
};
