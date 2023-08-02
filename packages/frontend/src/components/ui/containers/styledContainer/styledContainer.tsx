import { ReactNode } from 'react';
import * as styles from './styledContainer.linaria';

interface StyledContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const StyledContainer: React.FC<StyledContainerProps> = ({
  children,
  style
}) => {
  return (
    <div style={style} className={styles.wrapper}>
      {children}
    </div>
  );
};

export default StyledContainer;
