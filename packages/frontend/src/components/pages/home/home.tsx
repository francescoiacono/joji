import { SocketProvider } from '@/providers/socketProvider';
import CreateRoomForm from './subcomponents/createRoomForm/createRoomForm';

const Home = () => {
  return (
    <SocketProvider>
      <CreateRoomForm />
    </SocketProvider>
  );
};

export default Home;
