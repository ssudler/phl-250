'use client';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('../../components/canvas'), {
  ssr: false,
});

export default function Draw() {
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