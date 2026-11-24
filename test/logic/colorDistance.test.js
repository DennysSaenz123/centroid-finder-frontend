import assert from 'node:assert/strict';
import {
  hexToR, hexToG, hexToB, colorDistance, hexStringToInt,
} from '../../src/logic/colorDistance.js';

describe('colorDistance.js', () => {
  describe('hexToR / hexToG / hexToB', () => {
    it('splits a color into its channels', () => {
      assert.equal(hexToR(0x12ab34), 0x12);
      assert.equal(hexToG(0x12ab34), 0xab);
      assert.equal(hexToB(0x12ab34), 0x34);
    });

    it('handles black and white', () => {
      assert.deepEqual([hexToR(0x000000), hexToG(0x000000), hexToB(0x000000)], [0, 0, 0]);
      assert.deepEqual([hexToR(0xffffff), hexToG(0xffffff), hexToB(0xffffff)], [255, 255, 255]);
    });
  });

  describe('colorDistance', () => {
    it('is 0 for identical colors', () => {
      assert.equal(colorDistance(0x336699, 0x336699), 0);
    });

    it('measures a single-channel difference', () => {
      assert.equal(colorDistance(0x000000, 0xff0000), 255);
      assert.equal(colorDistance(0x000000, 0x00ff00), 255);
      assert.equal(colorDistance(0x000000, 0x0000ff), 255);
    });

    it('matches the Euclidean formula', () => {
      assert.equal(colorDistance(0x000000, 0x030400), 5); // 3-4-5 triangle
      assert.equal(colorDistance(0x000000, 0xffffff), Math.sqrt(3 * 255 ** 2));
    });

    it('is symmetric', () => {
      assert.equal(colorDistance(0x102030, 0xa0b0c0), colorDistance(0xa0b0c0, 0x102030));
    });
  });

  describe('hexStringToInt', () => {
    it('parses hex with or without a leading #', () => {
      assert.equal(hexStringToInt('#ff8800'), 0xff8800);
      assert.equal(hexStringToInt('ff8800'), 0xff8800);
    });

    it('is case-insensitive', () => {
      assert.equal(hexStringToInt('#FFA200'), hexStringToInt('#ffa200'));
    });
  });
});