import Image from 'next/image';
import * as styles from './gameBox.linaria';

interface GameBoxProps {
  children: React.ReactNode;
  icon: string;
  onClick: () => void;
  selected?: boolean;
}

const GameBox: React.FC<GameBoxProps> = ({
  children,
  icon,
  onClick,
  selected
}) => {
  return (
    <div
      onClick={onClick}
      className={selected ? `${styles.box} ${styles.selected}` : styles.box}
    >
      <Image
        className={styles.icon}
        width={150}
        height={150}
        src={icon}
        alt='game icon'
      />
      <p className={styles.text}>{children}</p>
    </div>
  );
};

export default GameBox;
