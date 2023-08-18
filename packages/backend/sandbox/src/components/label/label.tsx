import classnames from 'classnames';
import styles from './label.module.scss';

interface LabelProps {
  color?: number;
  children?: React.ReactNode;
  className?: string;
}

export const Label = (props: LabelProps) => {
  const { color, children, className } = props;

  // Make sure `color` is between 1 and 7 by using modulo
  const col = (color || 1) % 7;

  return (
    <span
      data-color={col || undefined}
      className={classnames(styles.label, className)}
    >
      {children}
    </span>
  );
};
