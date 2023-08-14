'use client';
import { useRoom, useSocket } from '@/components/providers';

const Page = () => {
  const { socket } = useSocket();
  const { room, createRoom, leaveRoom } = useRoom();

  return (
    <>
      {!socket.connected ? null : (
        <>
          <button onClick={() => createRoom('Francesco', 'Avatar')}>
            Create room
          </button>
          {room ? (
            <>
              <p>Room code: {room.joinCode}</p>
              <button onClick={() => leaveRoom()}>Leave room</button>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default Page;
