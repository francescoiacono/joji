'use client';

import { RoomEvent, SocketEvent } from '@joji/types';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

type FormState = {
  error: string;
  loading: boolean;
  data: any;
};

const CreateRoomForm = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [hostName, setHostName] = useState<string>('');
  const [formState, setFormState] = useState<FormState>({
    error: '',
    loading: true,
    data: null
  });

  const router = useRouter();

  useEffect(() => {
    if (!socket) {
      initialiseSocket();
    } else {
      handleListeners();
    }
  }, [socket]);

  const initialiseSocket = () => {
    setFormState({ ...formState, loading: true });
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
      setFormState({
        ...formState,
        error: 'Server URL is not defined',
        loading: false
      });
    } else {
      setSocket(io(serverUrl));
      setFormState({ ...formState, loading: false });
    }
  };

  const handleListeners = () => {
    socket?.on(RoomEvent.RoomCreated, data => {
      setFormState({ ...formState, error: '', data });
    });

    socket?.on(SocketEvent.Error, error => {
      setFormState({ ...formState, error: error.code });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHostName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit(RoomEvent.CreateRoom, { hostName: hostName });
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <h2>Create a room!</h2>
      </section>
      <section>
        <label>Room Name</label>
        <input type='text' placeholder='Your name!' onChange={handleChange} />
      </section>

      <section>{formState.error}</section>

      <button>Submit</button>
    </form>
  );
};

export default CreateRoomForm;
