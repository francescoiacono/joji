'use client';

import Form from '@/components/ui/forms/form/form';
import FormTitle from '@/components/ui/forms/formTitle/formTitle';
import FormInput from '@/components/ui/forms/formInput/formInput';
import { useState } from 'react';
import { useParams } from 'next/navigation';

interface JoinRoomFormProps {
  joinRoom: (slug: string, displayName: string) => void;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({ joinRoom }) => {
  const [displayName, setDisplayName] = useState<string>('');
  const { slug } = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof slug === 'string') {
      joinRoom(slug, displayName);
    }
  };

  return (
    <Form onSubmit={handleSubmit} buttonText='Join'>
      <FormTitle>Join Room</FormTitle>
      <FormInput
        onChange={handleChange}
        labelText='Display Name'
        type='text'
        placeholder='Your name!'
      ></FormInput>
    </Form>
  );
};
export default JoinRoomForm;
