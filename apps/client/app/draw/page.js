'use client';
import React from 'react';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import SuccessModal from '../../components/draw/success-modal';
import { Formik, Field, Form } from 'formik';
import TextInput from '../../components/draw/text-input';

const DrawingCanvas = dynamic(() => import('../../components/draw/canvas'), { ssr: false });

export default function Draw() {
  const [socketClient, setSocketClient] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [lines, setLines] = React.useState([]);
  const containerRef = React.useRef(null);
  const stageRef = React.useRef(null);

  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);

    socket.connect();

    setSocketClient(socket);

    return () => socket.disconnect();
  }, []);

  // TODO: Add validation (char length, no null, etc.)
  const handleSubmit = React.useCallback((values, { resetForm }) => {
    setIsSubmitting(true);
    setSuccessModalOpen(true);

    socketClient.emit('submit', {
      promptText: values.promptText,
      signatureImage: stageRef.current.toDataURL(),
    }, () => setIsSubmitting(false));

    resetForm();
  }, [socketClient, stageRef, isSubmitting, setIsSubmitting]);

  return (
    <>
      <SuccessModal isOpen={successModalOpen} setIsOpen={setSuccessModalOpen} />
      <div className="flex items-center justify-center flex-col absolute inset-0 box-border">
        <Formik
          initialValues={{ promptText: '' }}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form className="w-1/2 space-y-5" ref={containerRef}>
            <div className="flex gap-5">
              <p className="self-end text-7xl font-bold mb-3 whitespace-nowrap">PHILLY IS</p>
              <div className="flex shrink">
                <Field
                  as={TextInput}
                  name="promptText"
                  className="w-full mt-[-10px] text-7xl font-bold focus:outline-none border border-b-black border-2 border-t-white border-l-white border-r-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  autoFocus={true}
                />
                <p className="text-7xl font-bold mb-3">.</p>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <p className="text-lg text-gray-500">Fill in one word that describes your Philly</p>
            </div>
            <div className="pt-20">
              <p className="text-xl mb-3">Your signature here:</p>
              <DrawingCanvas
                isSubmitting={isSubmitting}
                container={containerRef}
                stageRef={stageRef}
                lines={lines}
                setLines={setLines}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Submit
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLines([]);
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded w-full"
              >
                Clear signature
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
}