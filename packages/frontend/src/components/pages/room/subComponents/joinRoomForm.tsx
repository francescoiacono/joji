'use client';

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
    <form onSubmit={handleSubmit}>
      <section>
        <h2>Join room</h2>
      </section>
      <section>
        <label>Display Name</label>
        <input type='text' placeholder='Your name!' onChange={handleChange} />
      </section>
      <button>Submit</button>
    </form>
  );
};
export default JoinRoomForm;
