'use client';

import Form from '@/components/ui/forms/form/form';
import FormTitle from '@/components/ui/forms/formTitle/formTitle';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Input from '@/components/ui/input/input';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';

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
    <StyledContainer
      style={{ width: '500px', height: '300px', padding: '1rem' }}
    >
      <Form onSubmit={handleSubmit} buttonText='Join'>
        <FormTitle>joji.gg</FormTitle>
        <Input
          onChange={handleChange}
          labelText='Display Name'
          type='text'
          placeholder='Your name!'
        ></Input>
      </Form>
    </StyledContainer>
  );
};
export default JoinRoomForm;
