'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { GameType, RoomClient, RoomEvent, SocketResponse } from '@joji/types';
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

    console.log('[UPDATE ROOM]');

    socket.on(RoomEvent.RoomUpdated, (updatedRoom: RoomClient) => {
      setRoom(updatedRoom);
      console.log(updatedRoom);
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
      console.log('[CREATE ROOM]');
      setLoading(true);

      socket.emit(
        RoomEvent.CreateRoom,
        { displayName },
        (response: SocketResponse<RoomClient>) => {
          handleSocketResponse(response, room => {
            setRoom(room);
            console.log(room);
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
      console.log('[GET ROOM]');
      setLoading(true);

      socket.emit(
        RoomEvent.GetRoomByJoinCode,
        { joinCode },
        (response: SocketResponse<RoomClient>) => {
          handleSocketResponse(response, room => {
            setRoom(room);
            console.log(room);
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
      console.log('[JOIN ROOM]');

      setLoading(true);

      socket.emit(
        RoomEvent.JoinRoom,
        { roomCode, displayName },
        (response: SocketResponse<RoomClient>) => {
          handleSocketResponse(response, room => {
            setRoom(room);
            console.log(room);
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

    console.log('[LEAVE ROOM]');

    setLoading(true);
    socket.emit(
      RoomEvent.LeaveRoom,
      {},
      (response: SocketResponse<RoomClient>) => {
        handleSocketResponse(response, room => {
          setRoom(room);
          console.log(room);
        });
      }
    );
  }, [socket]);

  const setRoomGame = useCallback(
    (game: GameType) => {
      if (!socket) return console.error('Socket not initialized');

      console.log('[SET ROOM GAME]');

      setLoading(true);
      socket.emit(
        RoomEvent.SetGame,
        { game },
        (response: SocketResponse<RoomClient>) => {
          handleSocketResponse(response, room => {
            setRoom(room);
            console.log(room);
          });
        }
      );
    },
    [socket]
  );

  return (
    <RoomContext.Provider
      value={{
        room,
        loading,
        getRoom,
        createRoom,
        joinRoom,
        leaveRoom,
        setRoomGame
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
