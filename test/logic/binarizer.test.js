import assert from 'node:assert/strict';
import { fakeImage } from '../helpers.js';
import { toBinaryArray, toImageData } from '../../src/logic/binarizer.js';

describe('binarizer.js', () => {
  describe('toBinaryArray', () => {
    it('returns an array shaped [height][width]', () => {
      const binary = toBinaryArray(fakeImage([[0, 0, 0], [0, 0, 0]]), 0x000000, 10);
      assert.equal(binary.length, 2);
      assert.equal(binary[0].length, 3);
    });

    it('marks pixels close to the target as 1 and others as 0', () => {
      const R = 0xff0000, B = 0x0000ff;
      const img = fakeImage([
        [R, B],
        [B, R],
      ]);
      assert.deepEqual(toBinaryArray(img, 0xff0000, 10), [[1, 0], [0, 1]]);
    });

    it('uses a strict < threshold, like the Java', () => {
      const img = fakeImage([[0x000000, 0x0a0000]]); // distances 0 and 10
      assert.deepEqual(toBinaryArray(img, 0x000000, 10), [[1, 0]]);
      assert.deepEqual(toBinaryArray(img, 0x000000, 11), [[1, 1]]);
    });

    it('matches nothing with threshold 0', () => {
      assert.deepEqual(toBinaryArray(fakeImage([[0xff0000]]), 0xff0000, 0), [[0]]);
    });

    it('matches everything with threshold 442', () => {
      const img = fakeImage([[0x000000, 0xffffff]]);
      assert.deepEqual(toBinaryArray(img, 0x000000, 442), [[1, 1]]);
    });

    it('ignores the alpha channel', () => {
      const img = fakeImage([[0xff0000]]);
      img.data[3] = 0; // fully transparent
      assert.deepEqual(toBinaryArray(img, 0xff0000, 1), [[1]]);
    });
  });

  describe('toImageData', () => {
    it('paints 1 as white and 0 as black, fully opaque', () => {
      const out = toImageData([[1, 0]]);
      assert.deepEqual([...out.data], [255, 255, 255, 255, 0, 0, 0, 255]);
    });

    it('keeps the width and height of the binary array', () => {
      const out = toImageData([[0, 0, 0], [1, 1, 1]]);
      assert.equal(out.width, 3);
      assert.equal(out.height, 2);
    });

    it('round-trips a binary array', () => {
      const binary = [[1, 0, 1], [0, 1, 0]];
      const img = toImageData(binary);
      assert.deepEqual(toBinaryArray(img, 0xffffff, 1), binary);
    });
  });
});