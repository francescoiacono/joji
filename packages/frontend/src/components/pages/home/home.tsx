import { SocketProvider } from '@/providers';
import CreateRoomForm from './subcomponents/createRoomForm/createRoomForm';

const Home = () => {
  return (
    <SocketProvider>
      <CreateRoomForm />
    </SocketProvider>
  );
};

export default Home;
