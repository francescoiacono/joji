'use client';

import { useRoom, useSocket } from '@/components/providers';
import { useState } from 'react';
import { DeathrollState, GameEvent, SocketSuccessResponse } from '@joji/types';

const DeathrollGame = () => {
  const { room } = useRoom();
  const { socket } = useSocket();

  const [number, setNumber] = useState<number | undefined>(
    room?.game?.options.startingValue
  );

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
    </div>
  );
};

export default DeathrollGame;
