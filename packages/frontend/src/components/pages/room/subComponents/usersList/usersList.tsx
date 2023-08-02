import { RoomUserClient } from '@joji/types';
import UserStrip from './userStrip/userStrip';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';

import * as styles from './usersList.linaria';

interface usersListProps {
  users: RoomUserClient[];
}

const UsersList: React.FC<usersListProps> = ({ users }) => {
  return (
    <StyledContainer style={{ width: '100%' }}>
      <h2>Players ({users.length})</h2>
      <div className={styles.container}>
        {users.map((user, i) => (
          <UserStrip key={i} user={user} />
        ))}
      </div>
    </StyledContainer>
  );
};

export default UsersList;
