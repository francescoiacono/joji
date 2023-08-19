import styles from './heading.module.scss';

interface HeadingProps {
  children?: React.ReactNode;
}

export const Heading = (props: HeadingProps) => {
  return <div className={styles.heading}>{props.children}</div>;
};
