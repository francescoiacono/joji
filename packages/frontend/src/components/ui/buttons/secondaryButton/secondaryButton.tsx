import * as styles from './secondaryButton.linaria';

const SecondaryButton = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`${styles.secondaryButton} ${props.className}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default SecondaryButton;
