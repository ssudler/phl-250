'use client';
import React from 'react';
import io from 'socket.io-client';

export default function Display() {
  const canvasRef = React.useRef(null);
  const [socketConnection, setSocketConnection] = React.useState(null);
  const [images, setImages] = React.useState([]);

  const setupCanvas = () => {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    // Draw text mask, use 250 image
    // ctx.font = "bold 75px 'Sans-serif'";
    // ctx.fillStyle = "#FF00FF";
    // ctx.fillText("PHL 250", 5, 60);
    //
    // ctx.globalCompositeOperation = "source-out";
  }

  const draw = (t) => {
    if (canvasRef.current.getContext) {
      const ctx = canvasRef.current.getContext('2d');

      images.forEach((image, index) => {
        const offsetX = ((((index % 5) * 200) + (t * 2)) % window.innerWidth) - 100;
        const offsetY = (Math.floor(index / 5) * 200) + 60;

        const textOffsetX = offsetX;
        const imageOffsetX = offsetX + 100;

        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("PHILLY IS", textOffsetX, offsetY);

        const img = new Image();
        img.src = image;
        ctx.drawImage(img, imageOffsetX, offsetY, 100, 100);
      });
    }
  }

  const update = () => {
    const fps = 30;
    let t = 0;

    if (canvasRef.current.getContext) {
      setInterval(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        draw(t);
        t++;
      }, 1000 / fps);
    }
  }

  React.useEffect(() => {
    const socket = io("http://10.0.0.236:7000");

    setSocketConnection(socket);

    setupCanvas();

    socket.on('displayImage', (data) => images.push(data.promptImage));

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    update();
  }, [images]);

  return (
    <main>
      <canvas ref={canvasRef} style={{ backgroundColor: 'white' }}>
      </canvas>
    </main>
  )
}
