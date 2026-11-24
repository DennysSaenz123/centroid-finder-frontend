import { hexStringToInt } from './colorDistance.js';
import { toBinaryArray } from './binarizer.js';
import { findConnectedGroups } from './groupFinder.js';

export * from './colorDistance.js';
export * from './binarizer.js';
export * from './group.js';
export * from './groupFinder.js';

// Runs the whole pipeline. Returns the binary array and the largest group (or null).
export function analyzeFrame(imageData, hexColor, threshold) {
  const binary = toBinaryArray(imageData, hexStringToInt(hexColor), threshold);
  const groups = findConnectedGroups(binary);
  return { binary, largest: groups.length > 0 ? groups[0] : null };
}