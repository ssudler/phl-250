'use client';
import React from 'react';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import SuccessModal from '../../components/draw/success-modal';

const Canvas = dynamic(() => import('../../components/draw/canvas'), {
  ssr: false,
});

export default function Draw() {
  const [socketClient, setSocketClient] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
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
    if (promptImage && signatureImage && isSubmitting) {
      socketClient.emit('submit', {
        promptImage: promptImage,
        signatureImage: signatureImage,
      });

      setPromptImage(null);
      setSignatureImage(null);
      setIsSubmitting(false);
    }
  }, [promptImage, signatureImage, isSubmitting]);

  return (
    <>
      <SuccessModal isOpen={successModalOpen} setIsOpen={setSuccessModalOpen}/>
      <div className="flex items-center justify-center flex-col bg-black absolute inset-0 box-border">
        <div className="w-1/2 space-y-5" ref={containerRef}>
          <div>
            <p className="text-white text-7xl font-bold mb-3">PHILLY IS...</p>
            <Canvas
              isSubmitting={isSubmitting}
              image={promptImage}
              setImage={setPromptImage}
              container={containerRef}
            />
          </div>
          <div>
            <p className="text-white text-xl font-bold mb-3">Your signature here:</p>
            <Canvas
              isSubmitting={isSubmitting}
              image={signatureImage}
              setImage={setSignatureImage}
              container={containerRef}
            />
          </div>
          <button
            onClick={() => {
              setIsSubmitting(true);
              setSuccessModalOpen(true);
            }}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}