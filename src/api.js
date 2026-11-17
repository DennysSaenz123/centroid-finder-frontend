const BASE = import.meta.env.VITE_API_URL;

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// GET /api/videos -> ["a.mp4", ...]
export const getVideos = () => request('/api/videos');

// use directly as <img src={thumbnailUrl(name)} />
export const thumbnailUrl = (filename) =>
  `${BASE}/thumbnail/${encodeURIComponent(filename)}`;

// POST /process/:filename?targetColor=&threshold= -> { jobId }
export const startJob = (filename, targetColor, threshold) => {
  const params = new URLSearchParams({
    targetColor: targetColor.replace(/^#/, ''),
    threshold: String(threshold),
  });
  return request(`/process/${encodeURIComponent(filename)}?${params}`, { method: 'POST' });
};

// GET /process/:jobId/status -> { status, result?, error? }
export const getJobStatus = (jobId) => request(`/process/${jobId}/status`);

// result is a path like "/results/a.mp4.csv"
export const resultUrl = (result) => `${BASE}${result}`;