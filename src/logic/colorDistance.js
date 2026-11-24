// Port of EuclideanColorDistance.java

export function hexToR(color) { return Math.trunc(color / 65536) % 256; }
export function hexToG(color) { return Math.trunc(color / 256) % 256; }
export function hexToB(color) { return color % 256; }

export function colorDistance(colorA, colorB) {
  const red = hexToR(colorA) - hexToR(colorB);
  const green = hexToG(colorA) - hexToG(colorB);
  const blue = hexToB(colorA) - hexToB(colorB);
  return Math.sqrt(red ** 2 + green ** 2 + blue ** 2);
}

// "#ff8800" or "ff8800" -> 0xff8800
export function hexStringToInt(hex) {
  return parseInt(hex.replace(/^#/, ''), 16);
}