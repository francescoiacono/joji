'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { RoomClient, RoomEvent, SocketResponse } from '@joji/types';
import { useRouter } from 'next/navigation';
import { useSocket } from './socketProvider';
import { RoomContext } from '../contexts';

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

    return () => {
      socket?.off(RoomEvent.RoomUpdated);
    };
  }, [socket]);

  const listenForRoomUpdates = () => {
    if (!socket) return console.error('Socket not initialized');

    socket.on(RoomEvent.RoomUpdated, (updatedRoom: RoomClient) => {
      setRoom(updatedRoom);
    });
  };

  /**
   * Handles the response from the socket
   * @param response is the response from the socket
   * @param callback is the callback function to be called if the response is successful
   *
   */

  const handleSocketResponse = (
    response: SocketResponse<RoomClient>,
    callback: (room: RoomClient) => void
  ) => {
    if (!response.success) {
      const { error } = response;
      console.error('Error:', error);
    } else {
      const room = response.data;
      callback(room);
    }
    setLoading(false);
  };

  /**
   * Creates a new room with host
   * @param displayName is the host name
   *
   */

  const createRoom = useCallback(
    (displayName: string) => {
      if (!socket) return console.error('Socket not initialized');
      setLoading(true);

      socket.emit(
        RoomEvent.CreateRoom,
        { displayName },
        (response: SocketResponse<RoomClient>) => {
          handleSocketResponse(response, room => {
            setRoom(room);
            router.push(`/room/${room.joinCode}`);
          });
        }
      );
    },
    [socket, router]
  );

  /**
   * Gets a room by join code
   * @param joinCode
   *
   */

  const getRoom = useCallback(
    (joinCode: string) => {
      if (!socket) return console.error('Socket not initialized');
      setLoading(true);

      socket.emit(
        RoomEvent.GetRoomByJoinCode,
        { joinCode },
        (response: SocketResponse<RoomClient>) => {
          handleSocketResponse(response, room => {
            setRoom(room);
          });
        }
      );
    },
    [socket]
  );

  /**
   * Joins a room by room code
   * @param roomCode is the join code of the room
   * @param displayName is the name of the user
   *
   */

  const joinRoom = useCallback(
    (roomCode: string, displayName: string) => {
      if (!socket) return console.error('Socket not initialized');

      setLoading(true);

      socket.emit(
        RoomEvent.JoinRoom,
        { roomCode, displayName },
        (response: SocketResponse<RoomClient>) => {
          handleSocketResponse(response, room => {
            setRoom(room);
          });
        }
      );
    },
    [socket]
  );

  /**
   * Leaves a room
   *
   */

  const leaveRoom = useCallback(() => {
    if (!socket) return console.error('Socket not initialized');

    setLoading(true);
    socket.emit(
      RoomEvent.LeaveRoom,
      {},
      (response: SocketResponse<RoomClient>) => {
        handleSocketResponse(response, room => {
          setRoom(room);
        });
      }
    );
  }, [socket]);

  return (
    <RoomContext.Provider
      value={{
        room,
        loading,
        getRoom,
        createRoom,
        joinRoom,
        leaveRoom
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
