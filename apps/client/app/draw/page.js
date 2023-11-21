'use client';
import React from 'react';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('../../components/draw/canvas'), {
  ssr: false,
});

export default function Draw() {
  React.useEffect(() => {
    const socket = io("http://10.0.0.236:7000");

    socket.emit('message', 'test');

    socket.on('message', (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div>
        <h1>PHILLY IS</h1>
        <Canvas />
      </div>
      <div>
        <h1>Your signature:</h1>
        <Canvas />
      </div>
    </div>
  );
}