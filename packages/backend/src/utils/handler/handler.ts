import { Session } from '@/services';
import { SocketResponse } from '@joji/types';
import { Socket } from 'socket.io';

export type Handler<TRequest, TResponse, TController> = (options: {
  data: TRequest;
  ack: (res: SocketResponse<TResponse>) => void;
  controller: TController;
  socket: Socket;
  session: Session;
}) => void;

export interface HandlerOptions<TRequest, TResponse, TController> {
  data: TRequest;
  ack: (res: SocketResponse<TResponse>) => void;
  controller: TController;
}

export const handler = <TRequest, TResponse, TController>(
  handler: Handler<TRequest, TResponse, TController>,
  controller: TController,
  socket: Socket,
  session: Session
) => {
  return (data: TRequest, ack: (res: SocketResponse<TResponse>) => void) => {
    handler({ data, ack, controller, socket, session });
  };
};
