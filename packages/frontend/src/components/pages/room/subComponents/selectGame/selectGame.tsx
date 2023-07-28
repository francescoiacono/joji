import PrimaryButton from '@/components/ui/buttons/primaryButton/primaryButton';
import { useRoom } from '@/components/providers';
import { GameType } from '@joji/types';

const SelectGame = () => {
  const { room, setRoomGame } = useRoom();

  const handleClick = (game: GameType) => {
    if (!room?.game && room?.isUserHost) {
      setRoomGame(game);
    }
  };

  if (!room) return <p>Room not found</p>;

  return (
    <section>
      {room?.isUserHost && (
        <>
          <label>Select Game </label>
          <PrimaryButton onClick={() => handleClick(GameType.Deathroll)}>
            Deathroll
          </PrimaryButton>
        </>
      )}
    </section>
  );
};

export default SelectGame;
