'use client';

import Form from '@/components/ui/forms/form/form';
import Input from '@/components/ui/input/input';
import AvatarBubble from '../avatarBubble/avatarBubble';

import { useState } from 'react';
import { useRoom } from '@/components/providers';

const CreateRoomForm = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('1.png');

  const { loading, createRoom } = useRoom();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createRoom(displayName, avatar);
  };

  return (
    <Form loading={loading} onSubmit={handleSubmit} buttonText='Create a room'>
      <AvatarBubble updateAvatar={setAvatar} />
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
