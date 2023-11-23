'use client';
import React from 'react';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('../../components/draw/canvas'), {
  ssr: false,
});

export default function Draw() {
  const [socketClient, setSocketClient] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [promptImage, setPromptImage] = React.useState(null);
  const [signatureImage, setSignatureImage] = React.useState(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);
    socket.connect();

    setSocketClient(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (promptImage && signatureImage) {
      socketClient.emit('createDrawing', {
        promptImage: promptImage,
        signatureImage: signatureImage,
      });
    }
  }, [promptImage, signatureImage]);

  return (
    <div className="flex items-center justify-center flex-col bg-black absolute inset-0 box-border">
      <div className="w-100 space-y-5" ref={containerRef}>
        <p className="text-white text-7xl font-bold">PHILADELPHIA IS...</p>
        <Canvas isSubmitting={isSubmitting} setImage={setPromptImage} container={containerRef} />
        <p className="text-white text-xl font-bold">Your signature here:</p>
        <Canvas isSubmitting={isSubmitting} setImage={setSignatureImage} container={containerRef} />
        <button
          onClick={() => setIsSubmitting(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
}