import Tabs from '@/components/ui/tabs/tabs';
import StyledContainer from '@/components/ui/containers/styledContainer/styledContainer';
import CreateRoomForm from './subcomponents/createRoomForm/createRoomForm';

const Home = () => {
  return (
    <StyledContainer style={{ width: '500px', height: '650px' }}>
      <h1>joji.gg</h1>
      <Tabs
        tabItems={[
          { label: 'CREATE', component: <CreateRoomForm /> },
          { label: 'JOIN', component: <p>Coming soon!</p> }
        ]}
      />
    </StyledContainer>
  );
};

export default Home;
