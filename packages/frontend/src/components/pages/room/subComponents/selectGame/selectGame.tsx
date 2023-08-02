import PrimaryButton from '@/components/ui/buttons/primaryButton/primaryButton';
import { useRoom } from '@/components/providers';
import { GameType } from '@joji/types';

const SelectGame: React.FC = () => {
  const { setRoomGame } = useRoom();

  const handleClick = (game: GameType) => {
    setRoomGame(game);
  };

  return (
    <section>
      <>
        <label>Select Game </label>
        <PrimaryButton onClick={() => handleClick(GameType.Deathroll)}>
          Deathroll
        </PrimaryButton>
      </>
    </section>
  );
};

export default SelectGame;
