import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { startJob, getJobStatus } from '../api';
import ColorPicker from '../components/ColorPicker';
import JobStatus from '../components/JobStatus';

const BASE = import.meta.env.VITE_API_URL;
const POLL_MS = 1500;

export default function VideoDetail() {
  const { filename } = useParams();
  const [color, setColor] = useState('#ff0000');
  const [threshold, setThreshold] = useState('100');
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);

  const running = job?.status === 'processing';

  async function handleSubmit(e) {
    e.preventDefault();
    // clamp to the API's 0–255 integer rule
    const t = Math.min(255, Math.max(0, Math.round(Number(threshold) || 0)));
    setThreshold(String(t));
    setJobId(null);
    setJob({ status: 'processing' }); // disables the form while the POST runs

    try {
      const { jobId } = await startJob(filename, color, t);
      setJobId(jobId);
    } catch (err) {
      setJob({ status: 'error', error: err.message });
    }
  }

  // poll job status until it's done or errors
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;

    const id = setInterval(async () => {
      try {
        const status = await getJobStatus(jobId);
        if (cancelled) return;
        setJob(status);
        if (status.status !== 'processing') clearInterval(id);
      } catch (err) {
        if (cancelled) return;
        setJob({ status: 'error', error: err.message });
        clearInterval(id);
      }
    }, POLL_MS);

    // stop polling when leaving the page or starting a new job
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [jobId]);

  return (
    <div className="video-detail">
      <Link to="/">← Back to videos</Link>
      <h2>{filename}</h2>

      <video
        src={`${BASE}/videos/${encodeURIComponent(filename)}`}
        controls
        width="640"
      />

      <form onSubmit={handleSubmit}>
        <ColorPicker value={color} onChange={setColor} disabled={running} />

        <label>
          Threshold (0–255)
          <input
            type="number"
            min="0"
            max="255"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            disabled={running}
          />
        </label>

        <button type="submit" disabled={running}>
          {running ? 'Processing…' : 'Process video'}
        </button>
      </form>

      <JobStatus job={job} />
    </div>
  );
}