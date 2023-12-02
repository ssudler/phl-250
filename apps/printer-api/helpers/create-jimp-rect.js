export default function createJimpRect(color) {
  return function (x, y, offset) {
    this.bitmap.data.writeUInt32BE(color, offset);
  }
}
