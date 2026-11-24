import assert from 'node:assert/strict';
import { fakeImage } from '../helpers.js';
import * as centroid from '../../src/logic/centroid.js';

describe('centroid.js', () => {
  it('re-exports every logic module', () => {
    const names = [
      'hexToR', 'colorDistance', 'hexStringToInt',
      'toBinaryArray', 'toImageData',
      'createGroup', 'compareGroups',
      'findConnectedGroups', 'findConnectedGroup', 'explore', 'possiblePixels',
      'analyzeFrame',
    ];
    for (const name of names) {
      assert.equal(typeof centroid[name], 'function', `${name} is not exported`);
    }
  });

  describe('analyzeFrame', () => {
    const R = 0xff0000, B = 0x000000;

    it('returns the binary array and the largest group', () => {
      const img = fakeImage([
        [R, R, B, R],
        [R, R, B, B],
      ]);
      const { binary, largest } = centroid.analyzeFrame(img, '#ff0000', 10);
      assert.deepEqual(binary, [[1, 1, 0, 1], [1, 1, 0, 0]]);
      assert.deepEqual(largest, { size: 4, centroid: { x: 0, y: 0 } });
    });

    it('accepts the color with or without #', () => {
      const img = fakeImage([[R]]);
      assert.deepEqual(
        centroid.analyzeFrame(img, '#ff0000', 10),
        centroid.analyzeFrame(img, 'ff0000', 10),
      );
    });

    it('returns largest = null when nothing matches', () => {
      const { largest } = centroid.analyzeFrame(fakeImage([[B]]), '#ffffff', 10);
      assert.equal(largest, null);
    });
  });
});