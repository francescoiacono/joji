import classNames from 'classnames';
import styles from './card.module.scss';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card = (props: CardProps) => {
  const { children, className } = props;

  return <div className={classNames(styles.card, className)}>{children}</div>;
};
