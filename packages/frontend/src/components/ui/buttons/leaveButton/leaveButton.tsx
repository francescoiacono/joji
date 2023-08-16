import { useRoom } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { SecondaryButton } from '../secondaryButton/secondaryButton';

export const LeaveButton = () => {
  const { leaveRoom } = useRoom();
  const router = useRouter();

  const leave = () => {
    leaveRoom();
    router.push('/');
  };
  return <SecondaryButton onClick={leave}>Leave</SecondaryButton>;
};
