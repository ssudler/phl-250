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
        prompt: promptImage,
        signature: signatureImage,
      });
    }
  }, [promptImage, signatureImage]);

  return (
    <div>
      <div>
        <h1>PHILLY IS</h1>
        <Canvas isSubmitting={isSubmitting} setImage={setPromptImage} />
      </div>
      <div>
        <h1>Your signature:</h1>
        <Canvas isSubmitting={isSubmitting} setImage={setSignatureImage} />
      </div>
      <button
        onClick={() => setIsSubmitting(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
}