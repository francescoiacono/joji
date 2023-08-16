'use client';
import {
  GameEvent,
  GameOptions,
  GameState,
  GameType,
  RoomClient,
  RoomEvent
} from '@joji/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socketProvider';
import { RoomManager } from '@/libs/roomManager';

interface RoomProviderProps {
  children: React.ReactNode;
}

interface RoomContextProps {
  room: RoomClient | null;
  game: GameState | null;
  createRoom: (displayName: string, avatar: string) => void;
  joinRoom: (roomCode: string, displayName: string) => void;
  leaveRoom: () => void;
  setGame: (game: GameType) => void;
  setGameOptions: (options: GameOptions) => void;
  startGame: () => void;
}

const RoomContext = createContext<RoomContextProps | null>(null);

export const RoomProvider = (props: RoomProviderProps) => {
  const { socket } = useSocket();
  const { children } = props;
  const roomManager = RoomManager.getInstance(socket);

  const [room, setRoom] = useState<RoomClient | null>(roomManager.currentRoom);
  const [gameState, setGameState] = useState<GameState | null>(
    roomManager.currentGameState
  );

  useEffect(() => {
    const handleRoomUpdate = (updatedRoom: RoomClient) => {
      setRoom(updatedRoom);
    };

    const handleGameStateUpdate = (updatedGameState: GameState) => {
      setGameState(updatedGameState);
    };

    roomManager.on(RoomEvent.RoomUpdated, handleRoomUpdate);
    roomManager.on(GameEvent.GameStateUpdated, handleGameStateUpdate);

    return () => {
      roomManager.off(RoomEvent.RoomUpdated, handleRoomUpdate);
      roomManager.off(GameEvent.GameStateUpdated, handleGameStateUpdate);
    };
  }, [roomManager]);

  return (
    <RoomContext.Provider
      value={{
        room,
        game: gameState,
        createRoom: roomManager.createRoom.bind(roomManager),
        joinRoom: roomManager.joinRoom.bind(roomManager),
        leaveRoom: roomManager.leaveRoom.bind(roomManager),
        setGame: roomManager.setGame.bind(roomManager),
        setGameOptions: roomManager.setGameOptions.bind(roomManager),
        startGame: roomManager.startGame.bind(roomManager)
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
