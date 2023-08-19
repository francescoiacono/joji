import { useSocket } from '@/components/providers/socket';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';

export const RoomActions = () => {
  const { socket } = useSocket();
  const isDisabled = !socket.connected;

  return (
    <Card>
      <Heading>Room Actions</Heading>

      <Card>
        <Heading>Create Room</Heading>
        <Button
          onClick={() => socket.emit('CREATE_ROOM')}
          disabled={isDisabled}
        >
          Create Room
        </Button>
      </Card>
    </Card>
  );
};
