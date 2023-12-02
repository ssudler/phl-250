'use client';
import React from 'react';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import SuccessModal from '../../components/draw/success-modal';
import { Formik, Field, Form } from 'formik';
import TextInput from '../../components/draw/text-input';

const DrawingCanvas = dynamic(() => import('../../components/draw/drawing-canvas'), { ssr: false });

export default function Draw() {
  const [socketClient, setSocketClient] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  const stageRef = React.useRef(null);

  React.useEffect(() => {
    // TODO: Fix for production
    const socket = io('http://localhost:7000');

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
            <div>
              <p className="text-7xl font-bold mb-3">PHILLY IS...</p>
              <Field
                as={TextInput}
                name="promptText"
                className="w-full text-3xl py-2 font-bold focus:outline-none border border-b-gray-400 border-t-white border-l-white border-r-white"
              />
            </div>
            <div>
              <p className="text-xl mb-3">Your signature here:</p>
              <DrawingCanvas
                isSubmitting={isSubmitting}
                container={containerRef}
                stageRef={stageRef}
              />
            </div>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </>
  );
}