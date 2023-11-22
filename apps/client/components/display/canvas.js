import io from "socket.io-client";

// TODO: Finish abstraction
export default function Display() {
  React.useEffect(() => {
    const socket = io("http://10.0.0.236:7000");

    setSocketConnection(socket);

    setupCanvas();

    socket.on('displayImage', (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);


}