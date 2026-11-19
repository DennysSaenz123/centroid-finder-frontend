const BASE = import.meta.env.VITE_API_URL;

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// GET /api/videos -> ["a.mp4", ...]
export const getVideos = async() => {
    return request('/api/videos');
}

// use directly as <img src={thumbnailUrl(name)} />
export const thumbnailUrl = (filename) =>
  `${BASE}/thumbnail/${encodeURIComponent(filename)}`;

// POST /process/:filename?targetColor=&threshold= -> { jobId }
export const startJob = async (filename, targetColor, threshold) => {
  const params = new URLSearchParams({
    targetColor: targetColor.replace(/^#/, ''),
    threshold: String(threshold),
  });
  return request(`/process/${encodeURIComponent(filename)}?${params}`, { method: 'POST' });
};

// GET /process/:jobId/status -> { status, result?, error? }
export const getJobStatus = async (jobId) => {
  return request(`/process/${jobId}/status`);
};

// POST /api/videos (multipart) -> { filename }
export const uploadVideo = async (file) => {
  const form = new FormData();
  form.append('video', file); // must match upload.single('video')
  return request('/api/videos', { method: 'POST', body: form });
};

// result is a path like "/results/a.mp4.csv"
export const resultUrl = (result) => `${BASE}${result}`;