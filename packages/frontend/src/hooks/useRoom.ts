import { useSocket } from '@/providers';
import { RoomClient, RoomEvent, SocketResponse } from '@joji/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const useRoom = () => {
  const [room, setRoom] = useState<RoomClient>();
  const { socket } = useSocket();

  const router = useRouter();

  const createRoom = (displayName: string) => {
    socket?.emit(
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

  const getRoom = (joinCode: string) => {
    socket?.emit(
      RoomEvent.GetRoomByJoinCode,
      { joinCode },
      (response: SocketResponse<RoomClient>) => {
        if (!response.success) {
          const { error } = response;
          console.error('Error:', error);
        } else {
          console.log(response);
          const room = response.data;
          setRoom(room);
        }
      }
    );
  };

  return { room, createRoom, getRoom };
};

export default useRoom;
