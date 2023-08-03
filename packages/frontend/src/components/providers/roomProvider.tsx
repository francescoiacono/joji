'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import {
  GameOptions,
  GameType,
  RoomClient,
  RoomEvent,
  SocketResponse
} from '@joji/types';
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

  const listenForRoomUpdates = useCallback(
    (updatedRoom: RoomClient) => {
      setRoom(updatedRoom);
    },
    [room]
  );

  useEffect(() => {
    const listener = (updatedRoom: RoomClient) =>
      listenForRoomUpdates(updatedRoom);
    socket?.on(RoomEvent.RoomUpdated, listener);

    return () => {
      socket?.off(RoomEvent.RoomUpdated, listener);
      return;
    };
  }, [socket, listenForRoomUpdates]);

  /**
   * emitWithResponse()
   * This function involves emitting a socket event,
   * waiting for a response, and then performing some action based on that response
   */

  const emitWithResponse = useCallback(
    async (
      event: RoomEvent,
      payload: object,
      callback: (room: RoomClient) => void
    ) => {
      if (!socket) throw new Error('Socket not initialized');
      setLoading(true);

      const response: SocketResponse<RoomClient> = await new Promise(resolve =>
        socket.emit(event, payload, resolve)
      );

      if (!response.success) {
        throw new Error(response.error);
      }

      const room = response.data;
      callback(room);
      setLoading(false);
    },
    [socket]
  );

  // The following functions are used to interact with the room

  const createRoom = useCallback(
    (displayName: string, avatar: string) =>
      emitWithResponse(RoomEvent.CreateRoom, { displayName, avatar }, room => {
        console.log('[Created room]', room);
        setRoom(room);
        router.push(`/room/${room.joinCode}`);
      }),
    [emitWithResponse, router]
  );

  const getRoom = useCallback(
    (joinCode: string) =>
      emitWithResponse(RoomEvent.GetRoomByJoinCode, { joinCode }, room => {
        console.log('[Get room]', room);
        setRoom(room);
      }),
    [emitWithResponse]
  );

  const joinRoom = useCallback(
    (roomCode: string, displayName: string) =>
      emitWithResponse(RoomEvent.JoinRoom, { roomCode, displayName }, room => {
        console.log('[Join room]', room);
        setRoom(room);
      }),
    [emitWithResponse]
  );

  const leaveRoom = useCallback(
    () =>
      emitWithResponse(RoomEvent.LeaveRoom, {}, room => {
        console.log('[Leave room]', room);
        setRoom(room);
      }),
    [emitWithResponse]
  );

  const setRoomGame = useCallback(
    (game: GameType) =>
      emitWithResponse(RoomEvent.SetGame, { game }, room => {
        console.log('[Set room game]', room);
        setRoom(room);
      }),
    [emitWithResponse]
  );

  const setGameOptions = useCallback(
    (options: GameOptions) =>
      emitWithResponse(RoomEvent.SetGameOptions, options, room => {
        console.log('[Get room game options]', room);
        setRoom(room);
      }),
    [emitWithResponse]
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
        setRoomGame,
        setGameOptions
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
