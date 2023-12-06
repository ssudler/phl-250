'use client';
import React from 'react';
import io from 'socket.io-client';
import NextImage from 'next/image';
import clsx from 'clsx';

export default function Display() {
  const canvasRef = React.useRef(null);
  const [showStaticImage, setShowStaticImage] = React.useState(false);
  const [images, setImages] = React.useState({ data: [], lastIndexReplaced: null });
  const [canvasMounted, setCanvasMounted] = React.useState(false);

  // TODO: Refactor to be infinite scroll
  const imagesPerRow = 10;
  const imageRows = 9;
  const maxImages = imagesPerRow * imageRows;

  const draw = (time) => {
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
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL);

    socket.on('displayImage', (data) => {
      const signatureImage = new Image();

      signatureImage.onload = () => {
        setImages((prevImages) => {
          if (prevImages.data.length === maxImages) {
            const indexToReplace = prevImages.lastIndexReplaced !== null
              ? (prevImages.lastIndexReplaced + 1) % maxImages
              : 0;

            const updatedImageData = [
              ...prevImages.data.slice(0, indexToReplace),
              signatureImage,
              ...prevImages.data.slice(indexToReplace + 1)
            ];

            return {
              data: updatedImageData,
              lastIndexReplaced: indexToReplace,
            }
          }

          return {
            data: prevImages.data.concat(signatureImage),
            lastIndexReplaced: null,
          };
        });
      }

      const updatedLocalStorage = JSON.stringify(
        JSON.parse(localStorage.getItem('imageSignatures') || '[]')
        .concat(data.signatureImage)
      );

      localStorage.setItem('imageSignatures', updatedLocalStorage);

      signatureImage.src = data.signatureImage;
    });

    return () => socket.disconnect();
  }, []);

  React.useEffect(() => {
    draw(0);
  }, [canvasMounted, images]);

  React.useEffect(() => {
    (async () => {
      const localImages = JSON.parse(localStorage.getItem('imageSignatures') || '[]');

      const loadedImages = await Promise.all(localImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();

          img.src = src;
          img.onload = () => resolve(img);
        });
      }));

      setImages({ data: loadedImages, lastIndexReplaced: null });
    })();

    const showStaticImageInterval = 60;
    const showStaticImageDuration = 15;

    const intervalId = setInterval(() => {
      setShowStaticImage(true);

      setTimeout(() => setShowStaticImage(false), showStaticImageDuration * 1000);
    }, showStaticImageInterval * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="absolute p-0">
      <div className={clsx({'fade-in opacity-100' : showStaticImage, 'fade-out opacity-0': !showStaticImage }, 'absolute h-screen w-screen bg-black z-50 ')}>
        <div className="h-full w-full flex flex-col items-center justify-center">
          <h1 className="text-white text-[160px] font-bold body-font font-roboto">Philly is <u>&emsp;&emsp;&emsp;&emsp;.</u></h1>
        </div>
        <div className="absolute flex mt-[-130px] justify-center w-full">
          <NextImage
            src="/250-logo.png"
            alt="PHL 250 logo"
            width={250}
            height={250}
          />
        </div>
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
