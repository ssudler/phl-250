import React from 'react';
import io from "socket.io-client";

export default function View() {
  // TODO: Create socket logic to receive images to be displayed
  // TODO: Create CSS "250" mask using canvas
  // TODO: Create logic to pull images from socket and display them
  // TODO: Create CSS to scroll horizontally

  React.useEffect(() => {
    const socket = io("http://10.0.0.236:7000");

    socket.on('message', (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      View
    </main>
  )
}
