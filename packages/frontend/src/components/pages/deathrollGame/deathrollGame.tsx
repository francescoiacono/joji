'use client';

import { useRoom, useSocket } from '@/components/providers';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DeathrollState, GameEvent, SocketSuccessResponse } from '@joji/types';

const DeathrollGame = () => {
  const { getRoom, room } = useRoom();
  const { game } = room || {};
  const { options } = game || {};
  const { startingValue } = options || {};
  const { socket } = useSocket();
  const { slug } = useParams();

  const [number, setNumber] = useState<number | undefined>(
    startingValue || undefined
  );

  useEffect(() => {
    if (typeof slug === 'string') {
      getRoom(slug);
    }
  }, []);

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
