import UserStrip from './userStrip/userStrip';

import { RoomUserClient } from '@joji/types';
import { useRoom } from '@/components/providers';

import * as styles from './usersList.linaria';

interface usersListProps {
  users: RoomUserClient[];
}

const UsersList: React.FC<usersListProps> = ({ users }) => {
  return (
    <div className={styles.container}>
      <h2>Players ({users.length})</h2>
      <div>
        {users.map((user, i) => (
          <UserStrip key={i} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersList;
