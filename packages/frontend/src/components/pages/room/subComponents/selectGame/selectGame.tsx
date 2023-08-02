import PrimaryButton from '@/components/ui/buttons/primaryButton/primaryButton';
import { useRoom } from '@/components/providers';
import { GameType } from '@joji/types';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';
import DeathrollOptions from '../gameOptions/deathrollOptions/deathrollOptions';

const SelectGame: React.FC = () => {
  const { setRoomGame, room } = useRoom();

  const handleClick = (game: GameType) => {
    setRoomGame(game);
  };

  return (
    <StyledContainer style={{ width: '100%' }}>
      <label>Select Game </label>
      <PrimaryButton onClick={() => handleClick(GameType.Deathroll)}>
        Deathroll
      </PrimaryButton>

      {room?.game?.type === GameType.Deathroll && (
        <DeathrollOptions gameOptions={room.game.options} />
      )}
    </StyledContainer>
  );
};

export default SelectGame;
