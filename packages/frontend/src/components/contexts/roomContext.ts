import { createContext } from 'react';
import { RoomClient } from '@joji/types';

interface RoomContextProps {
  room: RoomClient | null;
  loading: boolean;
  createRoom: (displayName: string) => void;
  getRoom: (slug: string) => void;
  joinRoom: (slug: string, displayName: string) => void;
  leaveRoom: () => void;
}

export const RoomContext = createContext<RoomContextProps>({
  room: null,
  loading: true,
  getRoom: () => {},
  createRoom: () => {},
  joinRoom: () => {},
  leaveRoom: () => {}
});
