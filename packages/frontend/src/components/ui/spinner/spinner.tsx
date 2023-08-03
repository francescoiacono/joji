import * as styles from './spinner.linaria';

interface SpinnerProps {
  large?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ large }) => {
  return (
    <div
      className={large ? `${styles.loader} ${styles.large}` : styles.loader}
    ></div>
  );
};

export default Spinner;
