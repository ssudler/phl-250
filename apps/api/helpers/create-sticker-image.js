import Jimp from 'jimp';

export default async function createStickerImage(text) {
  try {
    const stickerBaseImage = await Jimp.read('../assets/sticker-base.png');

    const textPaddingLeft = 0;
    const textPaddingRight = 0;
    const textPaddingTop = 0;

    const textWidth = textPaddingLeft + Jimp.measureText(Jimp.FONT_SANS_16, text) + textPaddingRight;
    const stickerImageWidth = stickerBaseImage.bitmap.width + textWidth;

    return new Jimp(stickerImageWidth, stickerBaseImage.bitmap.height, (err, image) => {
      if (err) throw err;

      image.composite(stickerBaseImage, 0, 0);

      image.print(Jimp.FONT_SANS_16, stickerBaseImage.bitmap.width + textPaddingLeft, textPaddingTop, text);

      console.log('writing image');
      image.write('../assets/composite.png');

      return image.getBase64Async(Jimp.MIME_PNG);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}