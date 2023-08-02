import * as styles from './primaryButton.linaria';
const PrimaryButton = ({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={`${styles.primaryButton} ${props.className}`} {...props}>
      {props.children}
    </button>
  );
};

export default PrimaryButton;
