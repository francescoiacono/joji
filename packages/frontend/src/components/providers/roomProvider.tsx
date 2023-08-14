'use client';
import { GameOptions, GameType, RoomClient, RoomEvent } from '@joji/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketProvider';
import { RoomManager } from '@/libs/roomManager';

interface RoomProviderProps {
  children: React.ReactNode;
}

interface RoomContextProps {
  room: RoomClient | null;
  createRoom: (displayName: string, avatar: string) => void;
  joinRoom: (roomCode: string, displayName: string) => void;
  leaveRoom: () => void;
  setGame: (game: GameType) => void;
  setGameOptions: (options: GameOptions) => void;
}

const RoomContext = createContext<RoomContextProps | null>(null);

export const RoomProvider = (props: RoomProviderProps) => {
  const { socket } = useSocket();
  const { children } = props;
  const roomManager = RoomManager.getInstance(socket);

  const [room, setRoom] = useState<RoomClient | null>(roomManager.currentRoom);

  useEffect(() => {
    // TODO: fix type
    const handleRoomUpdate = (updatedRoom: any) => {
      setRoom(updatedRoom);
    };

    roomManager.on(RoomEvent.RoomUpdated, handleRoomUpdate);

    return () => {
      roomManager.off(RoomEvent.RoomUpdated, handleRoomUpdate);
    };
  }, [roomManager]);

  return (
    <RoomContext.Provider
      value={{
        room,
        createRoom: roomManager.createRoom.bind(roomManager),
        joinRoom: roomManager.joinRoom.bind(roomManager),
        leaveRoom: roomManager.leaveRoom.bind(roomManager),
        setGame: roomManager.setGame.bind(roomManager),
        setGameOptions: roomManager.setGameOptions.bind(roomManager)
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
