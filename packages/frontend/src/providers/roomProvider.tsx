'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { RoomClient, RoomEvent, SocketResponse } from '@joji/types';
import { useRouter, useParams } from 'next/navigation';
import { useSocket } from './socketProvider';

interface RoomContextProps {
  room: RoomClient | null;
  loading: boolean;
  createRoom: (displayName: string) => void;
  getRoom: (slug: string) => void;
  joinRoom: (slug: string, displayName: string) => void;
}

const RoomContext = createContext<RoomContextProps>({
  room: null,
  loading: true,
  getRoom: () => {},
  createRoom: () => {},
  joinRoom: () => {}
});

interface RoomProviderProps {
  children: React.ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const router = useRouter();
  const [room, setRoom] = useState<RoomClient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { socket } = useSocket();

  useEffect(() => {
    listenForRoomUpdates();
  }, []);

  const listenForRoomUpdates = () => {
    if (!socket) return console.error('Socket not initialized');

    socket.on(RoomEvent.RoomUpdated, (updatedRoom: RoomClient) => {
      console.log('[OLD ROOM]:', room);
      console.log('[UPDATE ROOM]:', updatedRoom);
      setRoom(updatedRoom);
    });
  };

  /**
   * Creates a new room with host
   * @param displayName is the host name
   */
  const createRoom = (displayName: string) => {
    if (!socket) return console.error('Socket not initialized');
    setLoading(true);

    socket.emit(
      RoomEvent.CreateRoom,
      { displayName },
      (response: SocketResponse<RoomClient>) => {
        if (!response.success) {
          const { error } = response;
          console.error('Error:', error);
        } else {
          console.log('[CREATE ROOM]:', response.data);
          const room = response.data;
          setRoom(room);
          router.push(`/room/${room.joinCode}`);
        }
        setLoading(false);
      }
    );
  };

  /**
   * Gets a room by join code
   * @param joinCode
   */
  const getRoom = (joinCode: string) => {
    if (!socket) return console.error('Socket not initialized');
    setLoading(true);

    socket.emit(
      RoomEvent.GetRoomByJoinCode,
      { joinCode },
      (response: SocketResponse<RoomClient>) => {
        if (!response.success) {
          const { error } = response;
          console.error('Error:', error);
        } else {
          console.log('[GET ROOM]:', response.data);
          const room = response.data;
          setRoom(room);
        }
        setLoading(false);
      }
    );
  };

  /**
   * Joins a room by room code
   *
   */

  const joinRoom = (roomCode: string, displayName: string) => {
    if (!socket) return console.error('Socket not initialized');

    setLoading(true);

    socket.emit(
      RoomEvent.JoinRoom,
      { roomCode, displayName },
      (response: SocketResponse<RoomClient>) => {
        if (!response.success) {
          const { error } = response;
          console.error('Error:', error);
        } else {
          console.log('[JOIN ROOM]:', response.data);
          const room = response.data;
          setRoom(room);
        }
        setLoading(false);
      }
    );
  };

  return (
    <RoomContext.Provider
      value={{
        room,
        loading,
        getRoom,
        createRoom,
        joinRoom
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
