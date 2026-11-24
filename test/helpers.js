// Shared helpers for the logic unit tests.

// Builds a fake ImageData ({ width, height, data }) from a 2D grid of 0xRRGGBB colors.
export function fakeImage(rows) {
  const height = rows.length;
  const width = rows[0].length;
  const data = new Uint8ClampedArray(width * height * 4);
  rows.flat().forEach((c, i) => {
    data[i * 4] = (c >> 16) & 255;
    data[i * 4 + 1] = (c >> 8) & 255;
    data[i * 4 + 2] = c & 255;
    data[i * 4 + 3] = 255;
  });
  return { width, height, data };
}

// ImageData only exists in browsers; a minimal stand-in so toImageData can run in Node.
if (typeof globalThis.ImageData === 'undefined') {
  globalThis.ImageData = class ImageData {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  };
}