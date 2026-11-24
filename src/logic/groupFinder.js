// Port of DfsBinaryGroupFinder.java
import { createGroup, compareGroups } from './group.js';

function validate(image) {
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
}

export function findConnectedGroups(image) {
  validate(image);

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
  for (const c of coordinates) {
    x += c.x;
    y += c.y;
  }
  const pixels = coordinates.length;
  // integer division, like Java
  return createGroup(pixels, Math.trunc(x / pixels), Math.trunc(y / pixels));
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

  if (row - 1 >= 0 && image[row - 1][col] === 1) possible.push({ x: col, y: row - 1 });              // UP
  if (row + 1 < image.length && image[row + 1][col] === 1) possible.push({ x: col, y: row + 1 });    // DOWN
  if (col - 1 >= 0 && image[row][col - 1] === 1) possible.push({ x: col - 1, y: row });              // LEFT
  if (col + 1 < image[row].length && image[row][col + 1] === 1) possible.push({ x: col + 1, y: row }); // RIGHT

  return possible;
}