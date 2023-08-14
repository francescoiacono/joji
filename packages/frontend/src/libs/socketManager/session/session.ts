import { SessionClient, SocketEvent } from '@joji/types';
import { Socket } from 'socket.io-client';

class Session {
  getSessionId = () => {
    if (typeof window === 'undefined') return;
    return localStorage.getItem('sessionId');
  };

  unsubscribe = (socketInstance: Socket) => {
    socketInstance.off(SocketEvent.Session);
  };

  initSessionListener = (socketInstance: Socket) => {
    socketInstance.on(SocketEvent.Session, (session: SessionClient) => {
      console.log('session', session);
      localStorage.setItem('sessionId', session.id);
    });
  };
}

export default Session;
