import * as yup from 'yup';
import { HandlerOptions } from '..';
import { RoomClient, SocketMessage } from '@joji/types';
import { schemaIsValid } from '@/utils';

interface Data {
  joinCode: string;
}
type Response = RoomClient | null;
type Options = HandlerOptions<Data, Response>;

const schema: yup.ObjectSchema<Partial<Data>> = yup.object({
  joinCode: yup.string().required().strict()
});

export const getRoomByJoinCodeHandler = (options: Options) => {
  const { server, session, data, ack } = options;
  const { roomManager } = server;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack({ success: false, error: SocketMessage.ValidationError });
  }

  // Get the room by the join code
  const room = roomManager.getRoom(data.joinCode);

  // Acknowledge the event with the room
  return ack({
    success: true,
    data: room?.getClient(session.user.id) ?? null
  });
};
