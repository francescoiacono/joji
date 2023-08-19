import styles from './actions.module.scss';
import { RoomActions } from './room-actions';

export const Actions = () => {
  return (
    <div className={styles.actions}>
      <RoomActions />
    </div>
  );
};
