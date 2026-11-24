import assert from 'node:assert/strict';
import { createGroup, compareGroups } from '../../src/logic/group.js';

describe('group.js', () => {
  describe('createGroup', () => {
    it('builds { size, centroid: { x, y } }', () => {
      assert.deepEqual(createGroup(5, 2, 3), { size: 5, centroid: { x: 2, y: 3 } });
    });
  });

  describe('compareGroups (Group.compareTo)', () => {
    it('compares by size first', () => {
      assert.ok(compareGroups(createGroup(5, 0, 0), createGroup(3, 9, 9)) > 0);
      assert.ok(compareGroups(createGroup(3, 9, 9), createGroup(5, 0, 0)) < 0);
    });

    it('breaks size ties by centroid x', () => {
      assert.ok(compareGroups(createGroup(3, 1, 9), createGroup(3, 2, 0)) < 0);
    });

    it('breaks x ties by centroid y', () => {
      assert.ok(compareGroups(createGroup(3, 1, 5), createGroup(3, 1, 2)) > 0);
    });

    it('returns 0 for equal groups', () => {
      assert.equal(compareGroups(createGroup(3, 1, 1), createGroup(3, 1, 1)), 0);
    });

    it('sorts descending like Collections.reverseOrder()', () => {
      const groups = [createGroup(2, 0, 0), createGroup(5, 1, 1), createGroup(2, 3, 0)];
      groups.sort((a, b) => compareGroups(b, a));
      assert.deepEqual(groups, [createGroup(5, 1, 1), createGroup(2, 3, 0), createGroup(2, 0, 0)]);
    });
  });
});