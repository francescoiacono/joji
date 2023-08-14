import { useRoom } from '@/components/providers';
import DeathrollOptions from '../gameOptions/deathrollOptions/deathrollOptions';
import { GameType } from '@joji/types';

import * as styles from './selectGame.linaria';
import GameBox from '../gameBox/gameBox';

const SelectGame: React.FC = () => {
  const { setGame, room } = useRoom();

  const handleClick = (game: GameType) => {
    setGame(game);
  };

  return (
    <div className={styles.container}>
      <h2>Select Game </h2>
      <GameBox
        onClick={() => handleClick(GameType.Deathroll)}
        selected={room?.game?.type === GameType.Deathroll}
        icon='/assets/icons/dice_icon.svg'
      >
        Deathroll
      </GameBox>

      {room?.game?.type === GameType.Deathroll && (
        <DeathrollOptions gameOptions={room.game.options} />
      )}
    </div>
  );
};

export default SelectGame;
