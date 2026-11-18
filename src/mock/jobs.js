export const mockJobId = '123e4567-e89b-12d3-a456-426614174000';

let polls = 0;

export function resetMockJob() {
  polls = 0;
}

export function nextMockStatus(filename) {
  polls++;
  if (polls < 3) return { status: 'processing' };
  return { status: 'done', result: `/mock/${filename}.csv` };
}