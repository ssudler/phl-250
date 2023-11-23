'use client';
import React from 'react';
import io from 'socket.io-client';

export default function Display() {
  const canvasRef = React.useRef(null);
  const [socketConnection, setSocketConnection] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const [updateInterval, setUpdateInterval] = React.useState(null);
  const [canvasMounted, setCanvasMounted] = React.useState(false);
  const imagesPerRow = 4;
  const imageRows = 4;
  const maxImages = imagesPerRow * imageRows;

  const draw = (time) => {
    // Draw text mask, use 250 image
    // ctx.font = "bold 75px 'Sans-serif'";
    // ctx.fillStyle = "#FF00FF";
    // ctx.fillText("PHL 250", 5, 60);
    //
    // ctx.globalCompositeOperation = "source-out";

    if (canvasRef.current && window && !canvasMounted) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      setCanvasMounted(true);
    }

    if (canvasRef.current.getContext) {
      const ctx = canvasRef.current.getContext('2d');

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const speedX = time * 0.05;
      const c = 0.2;

      // TODO: Memoize to improve efficiency
      images.forEach((image, index) => {
        const direction = Math.pow(-1, Math.floor(index / imagesPerRow));
        const columnSpacingX = (index % imagesPerRow) * (window.innerWidth / imagesPerRow);
        const offsetX = (columnSpacingX + speedX);
        const positionX = (1 / (1 - c)) * (((offsetX % window.innerWidth) * direction + (direction === 1 ? 0 : window.innerWidth)) - (window.innerWidth * c));
        const positionY = (Math.floor(index / imagesPerRow) * 200) + 60;

        const textOffsetX = positionX;
        const imageOffsetX = positionX + 200;

        ctx.font = "40px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("PHILLY IS", textOffsetX, 10 + positionY + (image.height / 4));

        ctx.drawImage(image, imageOffsetX, positionY, image.width / 2, image.height / 2);
      });
    }

    window.requestAnimationFrame(draw);
  };

  React.useEffect(() => {
    const socket = io("http://10.0.0.236:7000");

    setSocketConnection(socket);

    socket.on('displayImage', (data) => {
      console.log('received an image');

      setImages((prevImages) => {
        const pic = new Image();
        pic.src = data.promptImage;

        if (prevImages.length === maxImages) {
          return prevImages.slice(1, prevImages.length).concat(pic);
        }

        return prevImages.concat(pic);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    draw();
  }, [canvasMounted, images]);

  return (
    <main>
      <canvas ref={canvasRef} style={{ backgroundColor: 'black' }}>
      </canvas>
    </main>
  )
}
