import { RoomUserClient } from '@joji/types';
import UserStrip from './userStrip/userStrip';

interface usersListProps {
  users: RoomUserClient[];
}

const UsersList: React.FC<usersListProps> = ({ users }) => {
  return (
    <section>
      <h2>Players ({users.length})</h2>
      {users.map((user, i) => (
        <UserStrip key={i} user={user} />
      ))}
    </section>
  );
};

export default UsersList;
