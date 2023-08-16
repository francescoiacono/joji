import Spinner from '../../spinner/spinner';
import * as styles from './primaryButton.linaria';

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ ...props }) => {
  return (
    <button className={`${styles.primaryButton} ${props.className}`} {...props}>
      {props.children}
      {props.loading && <Spinner />}
    </button>
  );
};
