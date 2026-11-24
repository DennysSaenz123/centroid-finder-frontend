// Port of Group.java (record + compareTo)

export function createGroup(size, x, y) {
  return { size, centroid: { x, y } };
}

// same order as Group.compareTo: size, then centroid x, then centroid y
export function compareGroups(a, b) {
  if (a.size !== b.size) return a.size - b.size;
  if (a.centroid.x !== b.centroid.x) return a.centroid.x - b.centroid.x;
  return a.centroid.y - b.centroid.y;
}