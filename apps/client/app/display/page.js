'use client';
import React from 'react';
import io from 'socket.io-client';
import NextImage from 'next/image';
import clsx from 'clsx';

export default function Display() {
  const canvasRef = React.useRef(null);
  const [showStaticImage, setShowStaticImage] = React.useState({ showing: true, lastUpdated: 0 });
  const [images, setImages] = React.useState({ data: [], lastIndexReplaced: null });
  const [canvasMounted, setCanvasMounted] = React.useState(false);

  const imagesPerRow = 10;
  const imageRows = 9;
  const maxImages = imagesPerRow * imageRows;

  const draw = (time) => {
    const staticDurationVisible = 15;
    const canvasDurationVisible = 45;
    const secondsElapsed = Math.floor(time / 1000);
    const delta = secondsElapsed - showStaticImage.lastUpdated;

    if (showStaticImage.showing && (delta === staticDurationVisible)) {
      setShowStaticImage({
        showing: false,
        lastUpdated: secondsElapsed,
      });
    }

    if (!showStaticImage.showing && (delta === canvasDurationVisible)) {
      setShowStaticImage({
        showing: true,
        lastUpdated: secondsElapsed,
      });
    }

    if (canvasRef.current && window && !canvasMounted) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      setCanvasMounted(true);
    }

    if (canvasRef.current.getContext) {
      const ctx = canvasRef.current.getContext('2d');

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const speedX = time * 0.05;
      const c = 0.15;

      // TODO: Refactor for style
      images.data.forEach((image, index) => {
        const direction = -1;
        const columnSpacingX = (index % imagesPerRow) * (window.innerWidth / imagesPerRow);
        const offsetX = (columnSpacingX + speedX);

        const positionX = (1 / (1 - c)) * (((offsetX % window.innerWidth) * direction + (direction === 1 ? 0 : window.innerWidth)) - (window.innerWidth * c));
        const positionY = (Math.floor(index / imagesPerRow) * 50) + (window.innerHeight * 0.4);

        const imageOffsetX = positionX + 200;
        const scaledContentWidth = window.innerWidth / imagesPerRow;
        const scaledImageHeight = (scaledContentWidth / image.width) * image.height;

        ctx.drawImage(image, imageOffsetX, positionY, scaledContentWidth, scaledImageHeight);
      });
    }

    window.requestAnimationFrame(draw);
  };

  React.useEffect(() => {
    // TODO: Change in production
    const socket = io('http://localhost:7000');

    socket.on('displayImage', (data) => {
      const signatureImage = new Image();

      signatureImage.onload = () => {
        setImages((prevImages) => {
          if (prevImages.data.length === maxImages) {
            const indexToReplace = prevImages.lastIndexReplaced !== null
              ? (prevImages.lastIndexReplaced + 1) % maxImages
              : 0;
            const newData = [...prevImages.data.slice(0, indexToReplace), signatureImage, ...prevImages.data.slice(indexToReplace + 1)];

            return {
              data: newData,
              lastIndexReplaced: indexToReplace,
            }
          }

          return {
            data: prevImages.data.concat(signatureImage),
            lastIndexReplaced: null
          };
        });
      }

      signatureImage.src = data.signatureImage;
    });

    return () => socket.disconnect();
  }, []);

  React.useEffect(() => {
    draw(0);
  }, [canvasMounted, images, showStaticImage]);

  return (
    <main className="absolute p-0">
      <div className={clsx({ 'hidden': !showStaticImage.showing }, 'absolute h-screen w-screen bg-black z-50 flex items-center justify-center')}>
        <h1 className="text-white text-[160px] font-bold">Philly is <u>&emsp;&emsp;&emsp;&emsp;.</u></h1>
      </div>
      <div>
        <NextImage
          src="/250-mask.png"
          fill
          alt="250 mask"
        />
        <canvas ref={canvasRef}>
        </canvas>
      </div>
    </main>
  )
}
