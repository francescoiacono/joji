import PrimaryButton from '@/components/ui/buttons/primaryButton/primaryButton';
import { useState } from 'react';
import { useRoom } from '@/components/providers';
import { GameType } from '@joji/types';

const SelectGame = () => {
  const { setRoomGame } = useRoom();
  const [ready, setReady] = useState(false);

  const handleClick = () => {
    setRoomGame(GameType.Deathroll);
    setReady(true);
  };

  return (
    <section>
      <label>Select Game </label>
      {ready ? (
        <p>Ready!</p>
      ) : (
        <PrimaryButton onClick={handleClick}>Death Roll</PrimaryButton>
      )}
    </section>
  );
};

export default SelectGame;
