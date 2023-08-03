import PrimaryButton from '@/components/ui/buttons/primaryButton/primaryButton';
import Input from '@/components/ui/input/input';

import { useState } from 'react';
import { DeathrollOptions as Options, RoomEvent } from '@joji/types';
import { useRoom } from '@/components/providers';

interface DeathrollOptionsProps {
  gameOptions: Options;
}

const DeathrollOptions: React.FC<DeathrollOptionsProps> = ({ gameOptions }) => {
  const { setGameOptions } = useRoom();
  const [options, setOptions] = useState<Options>(gameOptions);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // remove leading 0
    const value = e.target.value.replace(/^0+/, '');
    setOptions(prevOptions => ({
      ...prevOptions,
      startingValue: parseInt(value) || prevOptions.startingValue
    }));
  };

  const handleClick = () => {
    setGameOptions(options);
  };

  return (
    <>
      <h2>Deathroll Options</h2>
      <div>
        <label>Starting Value</label>
        <Input
          type='number'
          value={options.startingValue}
          onChange={handleChange}
        />
      </div>
      <PrimaryButton onClick={handleClick}>Start Game</PrimaryButton>
    </>
  );
};

export default DeathrollOptions;
