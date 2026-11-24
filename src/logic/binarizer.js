// Port of DistanceImageBinarizer.java
import { colorDistance } from './colorDistance';

// imageData: canvas ImageData (RGBA bytes). Returns int[height][width] of 0/1.
export function toBinaryArray(imageData, targetColor, threshold) {
  const { width, height, data } = imageData;
  const binary = [];
  for (let y = 0; y < height; y++) {
    const row = new Array(width).fill(0);
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      // same as getRGB(x, y) & 0xFFFFFF: drop alpha
      const pixColor = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
      if (colorDistance(pixColor, targetColor) < threshold) row[x] = 1; // strict <, like the Java
    }
    binary.push(row);
  }
  return binary;
}

// int[height][width] -> ImageData (1 = white, 0 = black)
export function toImageData(binary) {
  const height = binary.length;
  const width = binary[0].length;
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const v = binary[y][x] === 1 ? 255 : 0;
      out.data[i] = v;
      out.data[i + 1] = v;
      out.data[i + 2] = v;
      out.data[i + 3] = 255;
    }
  }
  return out;
}