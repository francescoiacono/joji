import { SocketEvent } from '@joji/types';
import { Socket } from 'socket.io';

export const socketError = (socket: Socket, code: string): never => {
  socket.emit(SocketEvent.Error, { code });
  return null as never;
};
