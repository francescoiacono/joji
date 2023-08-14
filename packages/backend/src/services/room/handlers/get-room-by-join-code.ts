import * as yup from 'yup';
import { RoomController } from '../room-controller';
import { Handler, schemaIsValid } from '@/utils';
import { RoomClient, SocketMessage } from '@joji/types';

type Req = {
  joinCode: string;
};
type Res = RoomClient | null;
type Controller = RoomController;

const schema: yup.ObjectSchema<Partial<Req>> = yup.object({
  joinCode: yup.string().required().strict()
});

export const getRoomByJoinCodeHandler: Handler<
  Req,
  Res,
  Controller
> = options => {
  const { data, ack, controller, session } = options;
  const { roomService } = controller;

  // Validate the data
  if (!schemaIsValid(schema, data)) {
    return ack?.({ success: false, error: SocketMessage.ValidationError });
  }

  // Get the room by the join code
  const room = roomService.getRoom(data.joinCode);

  // Acknowledge the event with the room
  return ack?.({
    success: true,
    data: room?.getClient(session.user.id) ?? null
  });
};
