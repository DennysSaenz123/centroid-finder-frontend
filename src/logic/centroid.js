// Port of the Java image package (EuclideanColorDistance, DistanceImageBinarizer,
// DfsBinaryGroupFinder, Group). Works on canvas ImageData instead of BufferedImage.

/* ---------- EuclideanColorDistance ---------- */

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

/* ---------- DistanceImageBinarizer ---------- */

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
      const dis = colorDistance(pixColor, targetColor);
      if (dis < threshold) row[x] = 1; // strictly less than, like the Java
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

/* ---------- Group ---------- */

// same order as Group.compareTo: size, then centroid x, then centroid y
export function compareGroups(a, b) {
  if (a.size !== b.size) return a.size - b.size;
  if (a.centroid.x !== b.centroid.x) return a.centroid.x - b.centroid.x;
  return a.centroid.y - b.centroid.y;
}

/* ---------- DfsBinaryGroupFinder ---------- */

export function findConnectedGroups(image) {
  if (image == null) throw new TypeError('Input image cannot be null.');
  for (const row of image) {
    if (row == null) throw new TypeError('Input image cannot contain null rows.');
  }
  if (image.length === 0 || image[0].length === 0) {
    throw new RangeError('Input image cannot be empty.');
  }
  for (const row of image) {
    if (row.length !== image[0].length) throw new RangeError('Input image must be rectangular.');
    for (const value of row) {
      if (value !== 0 && value !== 1) throw new RangeError('Input image can only contain 0s and 1s.');
    }
  }

  const height = image.length;
  const width = image[0].length;
  const visited = new Uint8Array(width * height); // replaces Set<Coordinate>
  const groups = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (image[i][j] === 1 && !visited[i * width + j]) {
        groups.push(findConnectedGroup(image, { x: j, y: i }, visited));
      }
    }
  }

  groups.sort((a, b) => compareGroups(b, a)); // Collections.reverseOrder()
  return groups;
}

export function findConnectedGroup(image, start, visited) {
  const coordinates = explore(image, start, visited);
  let x = 0, y = 0;
  const pixels = coordinates.length;
  for (const c of coordinates) {
    x += c.x;
    y += c.y;
  }
  // integer division, like Java
  return { size: pixels, centroid: { x: Math.trunc(x / pixels), y: Math.trunc(y / pixels) } };
}

export function explore(image, current, visited) {
  const width = image[0].length;
  const groupCords = [];
  const stack = [current];

  while (stack.length > 0) {
    const pixel = stack.pop();
    const key = pixel.y * width + pixel.x;
    if (visited[key]) continue; // !visited.add(pixel)
    visited[key] = 1;
    groupCords.push(pixel);

    for (const n of possiblePixels(image, pixel)) {
      if (!visited[n.y * width + n.x]) stack.push(n);
    }
  }
  return groupCords;
}

export function possiblePixels(image, current) {
  const possible = [];
  const row = current.y, col = current.x;

  if (row - 1 >= 0 && image[row - 1][col] === 1) possible.push({ x: col, y: row - 1 });            // UP
  if (row + 1 < image.length && image[row + 1][col] === 1) possible.push({ x: col, y: row + 1 });  // DOWN
  if (col - 1 >= 0 && image[row][col - 1] === 1) possible.push({ x: col - 1, y: row });            // LEFT
  if (col + 1 < image[row].length && image[row][col + 1] === 1) possible.push({ x: col + 1, y: row }); // RIGHT

  return possible;
}

/* ---------- convenience for the preview page ---------- */

// Runs the whole pipeline. Returns the binary array and the largest group (or null).
export function analyzeFrame(imageData, hexColor, threshold) {
  const binary = toBinaryArray(imageData, hexStringToInt(hexColor), threshold);
  const groups = findConnectedGroups(binary);
  return { binary, largest: groups.length > 0 ? groups[0] : null };
}