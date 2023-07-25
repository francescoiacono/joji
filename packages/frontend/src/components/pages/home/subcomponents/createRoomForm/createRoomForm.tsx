'use client';

import { RoomEvent } from '@joji/types';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

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

  useEffect(() => {
    if (!socket) {
      initialiseSocket();
    } else {
      socket?.on(RoomEvent.RoomCreated, data => {
        console.log('Room Created', data);
        setFormState({ ...formState, data });
      });
    }
  }, [socket]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit(RoomEvent.CreateRoom, { hostName: hostName });
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHostName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>Create a room!</section>
      <section>
        <label>Room Name</label>
        <input type='text' placeholder='TripleHHH' onChange={handleChange} />
      </section>
      <button>Submit</button>
    </form>
  );
};

export default CreateRoomForm;
