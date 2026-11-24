import assert from 'node:assert/strict';
import {
  findConnectedGroups, findConnectedGroup, explore, possiblePixels,
} from '../../src/logic/groupFinder.js';

describe('groupFinder.js', () => {
  describe('possiblePixels', () => {
    it('returns neighbors in the Java order: up, down, left, right', () => {
      const image = [[0, 1, 0], [1, 1, 1], [0, 1, 0]];
      assert.deepEqual(possiblePixels(image, { x: 1, y: 1 }), [
        { x: 1, y: 0 }, { x: 1, y: 2 }, { x: 0, y: 1 }, { x: 2, y: 1 },
      ]);
    });

    it('stays inside the image at a corner', () => {
      assert.deepEqual(possiblePixels([[1, 1], [1, 1]], { x: 0, y: 0 }), [
        { x: 0, y: 1 }, { x: 1, y: 0 },
      ]);
    });

    it('ignores diagonal neighbors and 0s', () => {
      assert.deepEqual(possiblePixels([[1, 0], [0, 1]], { x: 0, y: 0 }), []);
    });
  });

  describe('explore', () => {
    it('collects every pixel in the group and marks them visited', () => {
      const image = [[1, 1], [0, 1]];
      const visited = new Uint8Array(4);
      const cords = explore(image, { x: 0, y: 0 }, visited);
      assert.equal(cords.length, 3);
      assert.deepEqual([...visited], [1, 1, 0, 1]);
    });

    it('does not revisit already-visited pixels', () => {
      const image = [[1, 1]];
      const visited = new Uint8Array([0, 1]); // (1,0) already visited
      assert.deepEqual(explore(image, { x: 0, y: 0 }, visited), [{ x: 0, y: 0 }]);
    });
  });

  describe('findConnectedGroup', () => {
    it('uses integer division for the centroid', () => {
      const image = [[1, 1]]; // x: (0 + 1) / 2 = 0.5 -> 0
      const group = findConnectedGroup(image, { x: 0, y: 0 }, new Uint8Array(2));
      assert.deepEqual(group, { size: 2, centroid: { x: 0, y: 0 } });
    });

    it('averages x and y separately', () => {
      const image = [
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]; // x: (1+2+1+2)/4 = 1, y: (1+1+2+2)/4 = 1
      const group = findConnectedGroup(image, { x: 1, y: 1 }, new Uint8Array(9));
      assert.deepEqual(group, { size: 4, centroid: { x: 1, y: 1 } });
    });
  });

  describe('findConnectedGroups', () => {
    it('finds all groups, sorted largest first', () => {
      const groups = findConnectedGroups([
        [1, 1, 0, 0],
        [1, 1, 0, 1],
        [0, 0, 0, 1],
      ]);
      assert.deepEqual(groups, [
        { size: 4, centroid: { x: 0, y: 0 } },
        { size: 2, centroid: { x: 3, y: 1 } },
      ]);
    });

    it('does not connect diagonal pixels', () => {
      assert.equal(findConnectedGroups([[1, 0], [0, 1]]).length, 2);
    });

    it('breaks size ties by x, then y, in descending order', () => {
      const byX = findConnectedGroups([[1, 0, 1]]);
      assert.deepEqual(byX.map(g => g.centroid.x), [2, 0]);

      const byY = findConnectedGroups([[1], [0], [1]]);
      assert.deepEqual(byY.map(g => g.centroid.y), [2, 0]);
    });

    it('treats an all-1 image as one group', () => {
      assert.deepEqual(findConnectedGroups([[1, 1], [1, 1]]), [
        { size: 4, centroid: { x: 0, y: 0 } },
      ]);
    });

    it('returns [] when there are no 1s', () => {
      assert.deepEqual(findConnectedGroups([[0, 0], [0, 0]]), []);
    });

    it('follows winding shapes', () => {
      const groups = findConnectedGroups([
        [1, 1, 1],
        [0, 0, 1],
        [1, 1, 1],
      ]);
      assert.equal(groups.length, 1);
      assert.equal(groups[0].size, 7);
    });

    it('throws on invalid input with the Java messages', () => {
      assert.throws(() => findConnectedGroups(null), /cannot be null/);
      assert.throws(() => findConnectedGroups([null]), /null rows/);
      assert.throws(() => findConnectedGroups([]), /cannot be empty/);
      assert.throws(() => findConnectedGroups([[]]), /cannot be empty/);
      assert.throws(() => findConnectedGroups([[1, 0], [1]]), /rectangular/);
      assert.throws(() => findConnectedGroups([[2]]), /only contain 0s and 1s/);
    });
  });
});