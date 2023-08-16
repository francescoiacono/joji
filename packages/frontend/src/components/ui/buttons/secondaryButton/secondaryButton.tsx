import * as styles from './secondaryButton.linaria';

export const SecondaryButton = ({
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
