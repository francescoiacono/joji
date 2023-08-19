import classNames from 'classnames';
import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { children, className, disabled, loading, ...rest } = props;

  return (
    <button
      className={classNames(styles.button, className, {
        [styles.loading]: loading
      })}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
};
