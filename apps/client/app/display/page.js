'use client';
import React from 'react';
import io from 'socket.io-client';

export default function Display() {
  const canvasRef = React.useRef(null);
  const [images, setImages] = React.useState({ data: [], lastIndexReplaced: null });
  const [canvasMounted, setCanvasMounted] = React.useState(false);

  const imagesPerRow = 4;
  const imageRows = 4;
  const maxImages = imagesPerRow * imageRows;

  const draw = (time) => {
    if (canvasRef.current && window && !canvasMounted) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      setCanvasMounted(true);
    }

    if (canvasRef.current.getContext) {
      const ctx = canvasRef.current.getContext('2d');

      // Draw text mask, use 250 image
      // ctx.font = "bold 75px 'Sans-serif'";
      // ctx.fillStyle = "#FF00FF";
      // ctx.fillText("PHL 250", 5, 60);
      //
      // ctx.globalCompositeOperation = "source-out";

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const speedX = time * 0.05;
      const c = 0.3;

      // TODO: Memoize to improve efficiency, use delta instead of time
      images.data.forEach((image, index) => {
        const direction = Math.pow(-1, Math.floor(index / imagesPerRow));
        const columnSpacingX = (index % imagesPerRow) * (window.innerWidth / imagesPerRow);
        const offsetX = (columnSpacingX + speedX);
        const positionX = (1 / (1 - c)) * (((offsetX % window.innerWidth) * direction + (direction === 1 ? 0 : window.innerWidth)) - (window.innerWidth * c));
        const positionY = (Math.floor(index / imagesPerRow) * 200) + 60;

        const textOffsetX = positionX;
        const imageOffsetX = positionX + 200;

        const scaledContentWidth = window.innerWidth / imagesPerRow;
        const scaledImageWidth = 0.5 * scaledContentWidth;
        const scaledImageHeight = (scaledImageWidth / image.width) * image.height;

        ctx.font = "40px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("PHILLY IS", textOffsetX, 15 + positionY + (scaledImageHeight / 2));

        ctx.drawImage(image, imageOffsetX, positionY, scaledImageWidth, scaledImageHeight);
      });
    }

    window.requestAnimationFrame(draw);
  };

  React.useEffect(() => {
    const socket = io("http://10.0.0.236:7000");

    socket.on('displayImage', (data) => {
      setImages((prevImages) => {
        const pic = new Image();
        pic.src = data.promptImage;

        if (prevImages.data.length === maxImages) {
          const indexToReplace = prevImages.lastIndexReplaced !== null ? prevImages.lastIndexReplaced + 1 : 0;
          console.log('replacing image at', indexToReplace);
          const newData = [...prevImages.data.slice(0, indexToReplace), pic, ...prevImages.data.slice(indexToReplace + 1)];

          return {
            data: newData,
            lastIndexReplaced: indexToReplace,
          }
        }

        return {
          data: prevImages.data.concat(pic),
          lastIndexReplaced: null
        };
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
