import Jimp from 'jimp';
import createJimpRect from './create-jimp-rect.js';

export default async function createStickerImage(text) {
  try {
    const stickerBaseImage = await Jimp.read('./assets/sticker-base.png');
    const font = await Jimp.loadFont('./assets/RobotoCondensed-Bold.fnt');

    const textNegativePaddingX = 510;
    const textPaddingRight = 100;
    const textPositionY = (stickerBaseImage.bitmap.height / 3) - 30;
    const textWidth = Jimp.measureText(font, text);
    const textHeight = Jimp.measureTextHeight(font, text, textWidth);

    const stickerImageWidth = (stickerBaseImage.bitmap.width + textWidth + textPaddingRight) - textNegativePaddingX;

    const image = new Jimp(stickerImageWidth, stickerBaseImage.bitmap.height, 'black');

    image.composite(stickerBaseImage, 0, 0);

    // Print text
    const textOffsetX = stickerBaseImage.bitmap.width - textNegativePaddingX;

    image.print(
      font,
      textOffsetX,
      textPositionY,
      text
    );

    // Create text underline
    const underlineThickness = 8;
    const underlineColor = 0xFFFFFFFF;
    const underlinePositionY = (textPositionY + textHeight) - 30;
    const underlineWidth = Jimp.measureText(font, text);

    image.scan(
      textOffsetX,
      underlinePositionY,
      underlineWidth,
      underlineThickness,
      createJimpRect(underlineColor)
    );

    console.log('writing image async');

    await image.writeAsync('./assets/composite.png');
  } catch (error) {
    console.error('Error:', error);
  }
}