'use client';
import React from 'react';
import io from 'socket.io-client';

export default function Display() {
  const canvasRef = React.useRef(null);
  const [socketConnection, setSocketConnection] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const [updateInterval, setUpdateInterval] = React.useState(null);
  const maxImages = 20;
  const imagesPerRow = 5;

  const setupCanvas = () => {
    console.log('setting up canvas');

    if (canvasRef.current && window) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      window.requestAnimationFrame(draw);
    }

    // Draw text mask, use 250 image
    // ctx.font = "bold 75px 'Sans-serif'";
    // ctx.fillStyle = "#FF00FF";
    // ctx.fillText("PHL 250", 5, 60);
    //
    // ctx.globalCompositeOperation = "source-out";
  }

  const draw = (time) => {
    if (canvasRef.current.getContext) {
      const ctx = canvasRef.current.getContext('2d');

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      images.forEach((image, index) => {
        const direction = Math.pow(-1, Math.floor(index / imagesPerRow));
        const speedX = time * 0.04;
        const columnSpacingX = (index % imagesPerRow) * (window.innerWidth / imagesPerRow);

        const c = 0.1;
        const offsetX = (columnSpacingX + speedX);
        const positionX = (1 / (1 - c)) * (((offsetX % window.innerWidth) * direction + (direction === 1 ? 0 : window.innerWidth)) - (window.innerWidth * c));
        const positionY = (Math.floor(index / imagesPerRow) * 200) + 60;

        const textOffsetX = positionX;
        const imageOffsetX = positionX + 100;

        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("PHILLY IS", textOffsetX, positionY);

        const img = new Image();
        img.src = image;
        ctx.drawImage(img, imageOffsetX, positionY, 100, 100);
      });
    }

    requestAnimationFrame(draw);
  }

  React.useEffect(() => {
    const socket = io("http://10.0.0.236:7000");

    setSocketConnection(socket);

    socket.on('displayImage', (data) => {
      console.log('received an image');

      setImages((prevImages) => {
        if (prevImages.length === maxImages) {
          const newArr = prevImages.shift();

          return newArr.concat(data.promptImage);
        }

        return prevImages.concat(data.promptImage);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // TODO: Fix this
  setupCanvas();

  return (
    <main>
      <canvas ref={canvasRef} style={{ backgroundColor: 'black' }}>
      </canvas>
    </main>
  )
}
