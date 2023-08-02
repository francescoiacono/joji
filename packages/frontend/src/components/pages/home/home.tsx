import Tabs from '@/components/ui/tabs/tabs';
import RoomForm from './subcomponents/roomForm/roomForm';

const Home = () => {
  return (
    <Tabs
      tabItems={[
        { label: 'CREATE', component: <RoomForm /> },
        { label: 'JOIN', component: <p>Hello</p> }
      ]}
    />
  );
};

export default Home;
