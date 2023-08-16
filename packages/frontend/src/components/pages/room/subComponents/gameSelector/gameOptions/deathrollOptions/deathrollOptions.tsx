import Input from '@/components/ui/input/input';

import { PrimaryButton } from '@/components/ui/buttons';
import { useEffect, useState } from 'react';
import { DeathrollOptions as Options, RoomEvent } from '@joji/types';
import { useRoom } from '@/components/providers';
import { useRouter, usePathname } from 'next/navigation';

interface DeathrollOptionsProps {
  gameOptions: Options;
}

export const DeathrollOptions: React.FC<DeathrollOptionsProps> = ({
  gameOptions
}) => {
  const router = useRouter();
  const path = usePathname();
  const { setGameOptions, startGame, game } = useRoom();
  const [options, setOptions] = useState<Options>(gameOptions);

  useEffect(() => {
    if (game) {
      router.push(`${path}/deathroll`);
    }
  }, [game, path, router]);

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
    startGame();
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
