import { mockVideoList } from './mock/videos';
import { mockJobId, nextMockStatus, resetMockJob } from './mock/jobs';

const BASE = import.meta.env.VITE_API_URL;

// set VITE_USE_MOCK=true in .env to use mock data
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// remembers which video the mock job is for
let mockFilename = '';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// GET /api/videos -> ["a.mp4", ...]
export const getVideos = async() => {
    if(USE_MOCK) {
        await delay(300);
        return mockVideoList;
    }
    return request('/api/videos');
}

// use directly as <img src={thumbnailUrl(name)} />
export const thumbnailUrl = (filename) =>
    USE_MOCK ? 'mock/thumbnail.jpg' :
  `${BASE}/thumbnail/${encodeURIComponent(filename)}`;

// POST /process/:filename?targetColor=&threshold= -> { jobId }
export const startJob = async (filename, targetColor, threshold) => {
    if(USE_MOCK){
        await delay(300);
        mockFilename = filename;
        resetMockJob();
        return { jobId: mockJobId };
    }
  const params = new URLSearchParams({
    targetColor: targetColor.replace(/^#/, ''),
    threshold: String(threshold),
  });
  return request(`/process/${encodeURIComponent(filename)}?${params}`, { method: 'POST' });
};

// GET /process/:jobId/status -> { status, result?, error? }
export const getJobStatus = async (jobId) => {
    if (USE_MOCK) {
    await delay(300);
    return nextMockStatus(mockFilename);
  }
  return request(`/process/${jobId}/status`);
};

// POST /api/videos (multipart) -> { filename }
export const uploadVideo = async (file) => {
  if (USE_MOCK) {
    await delay(300);
    return { filename: file.name };
  }
  const form = new FormData();
  form.append('video', file); // must match upload.single('video')
  return request('/api/videos', { method: 'POST', body: form });
};

// result is a path like "/results/a.mp4.csv"
export const resultUrl = (result) => `${BASE}${result}`;