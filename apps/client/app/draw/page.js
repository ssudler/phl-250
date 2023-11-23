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
    const socket = io('http://10.0.0.236:7000');
    socket.connect();

    setSocketClient(socket);

    socket.on('message', (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (promptImage && signatureImage) {
      console.log('submitted');
      console.log('prompt', promptImage);
      console.log('signature', signatureImage);

      socketClient.emit("createDrawing", {
        promptImage: promptImage,
        signatureImage: signatureImage,
      });
    }
  }, [promptImage, signatureImage]);

  return (
    <div className="flex items-center justify-center flex-col bg-black absolute inset-0">
      <div className="w-100 space-y-5" ref={containerRef}>
        <h1 className="text-white text-7xl">PHILADELPHIA IS ...</h1>
        <Canvas isSubmitting={isSubmitting} setImage={setPromptImage} container={containerRef} />
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