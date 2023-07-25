'use client';

import { RoomEvent, SocketEvent } from '@joji/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/providers/socketProvider';

type FormState = {
  error: string;
  loading: boolean;
  data: any;
};

const CreateRoomForm = () => {
  const { socket } = useSocket();
  const [hostName, setHostName] = useState<string>('');
  const [formState, setFormState] = useState<FormState>({
    error: '',
    loading: true,
    data: null
  });

  const router = useRouter();

  useEffect(() => {
    if (socket) {
      setFormState({ ...formState, loading: false });
      handleListeners();
    }

    if (formState.data) {
      router.push(`/room/${formState.data.id}`);
    }
  }, [socket, formState.data]);

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
    <section>
      {formState.loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <section>
            <h2>Create a room!</h2>
          </section>
          <section>
            <label>Room Name</label>
            <input
              type='text'
              placeholder='Your name!'
              onChange={handleChange}
            />
          </section>

          <section>{formState.error}</section>

          <button>Submit</button>
        </form>
      )}
    </section>
  );
};

export default CreateRoomForm;
