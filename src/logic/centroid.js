import { hexStringToInt } from './colorDistance';
import { toBinaryArray } from './binarizer';
import { findConnectedGroups } from './groupFinder';

export * from './colorDistance';
export * from './binarizer';
export * from './group';
export * from './groupFinder';

// Runs the whole pipeline. Returns the binary array and the largest group (or null).
export function analyzeFrame(imageData, hexColor, threshold) {
  const binary = toBinaryArray(imageData, hexStringToInt(hexColor), threshold);
  const groups = findConnectedGroups(binary);
  return { binary, largest: groups.length > 0 ? groups[0] : null };
}