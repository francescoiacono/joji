'use client';

import { useRoom, useSocket } from '@/components/providers';
import { useState } from 'react';
import { DeathrollState, GameEvent, SocketSuccessResponse } from '@joji/types';
import { LeaveButton, SecondaryButton } from '@/components/ui/buttons';
const DeathrollGame = () => {
  const { game } = useRoom();
  const { socket } = useSocket();

  const [number, setNumber] = useState<number | undefined>(game?.currentCount);

  const roll = () => {
    socket?.emit(
      GameEvent.DeathrollRoll,
      {},
      (event: SocketSuccessResponse<DeathrollState>) => {
        const { data } = event;
        setNumber(data.currentCount);
      }
    );
  };

  return (
    <div>
      <h1>Deathroll Game</h1>
      <h2>{number}</h2>
      <button onClick={roll}>Roll</button>
      <LeaveButton />
    </div>
  );
};

export default DeathrollGame;
