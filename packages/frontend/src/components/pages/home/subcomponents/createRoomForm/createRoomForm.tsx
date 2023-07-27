'use client';

import { useState } from 'react';
import { useRoom } from '@/providers';

const CreateRoomForm = () => {
  const [displayName, setDisplayName] = useState<string>('');

  const { createRoom } = useRoom();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createRoom(displayName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <h2>Create a room!</h2>
      </section>
      <section>
        <label>Display Name</label>
        <input type='text' placeholder='Your name!' onChange={handleChange} />
      </section>
      <button>Submit</button>
    </form>
  );
};

export default CreateRoomForm;
