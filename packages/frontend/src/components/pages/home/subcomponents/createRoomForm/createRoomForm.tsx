'use client';

import Form from '@/components/ui/forms/form/form';
import Input from '@/components/ui/input/input';
import { useState } from 'react';
import { useRoom } from '@/components/providers';

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
    <Form onSubmit={handleSubmit} buttonText='Create'>
      <Input
        type='text'
        placeholder='Your username!'
        onChange={handleChange}
        labelText='Display Name'
      />
    </Form>
  );
};

export default CreateRoomForm;
