import { useSocket } from '@/providers';
import { RoomClient, RoomEvent, SocketResponse } from '@joji/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const useRoom = () => {
  const [room, setRoom] = useState<RoomClient>();
  const { socket } = useSocket();

  const router = useRouter();

  /**
   * Creates a new room with host
   * @param displayName is the host name
   */

  const createRoom = (displayName: string) => {
    if (!socket) return console.error('Socket not initialized');

    socket.emit(
      RoomEvent.CreateRoom,
      { displayName },
      (response: SocketResponse<RoomClient>) => {
        if (!response.success) {
          const { error } = response;
          console.error('Error:', error);
        } else {
          const room = response.data;
          setRoom(room);
          router.push(`/room/${room.joinCode}`);
        }
      }
    );
  };

  /**
   * Gets a room by join code
   * @param joinCode
   */

  const getRoom = (joinCode: string) => {
    if (!socket) return console.error('Socket not initialized');

    console.log('Joining room with code:', joinCode);

    socket.emit(
      RoomEvent.GetRoomByJoinCode,
      { joinCode },
      (response: SocketResponse<RoomClient>) => {
        if (!response.success) {
          const { error } = response;
          console.error('Error:', error);
        } else {
          console.log('Success:', response);
          const room = response.data;
          setRoom(room);
        }
      }
    );
  };

  return { room, createRoom, getRoom };
};

export default useRoom;
