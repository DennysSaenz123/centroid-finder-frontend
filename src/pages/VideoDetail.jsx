import { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { useParams, Link } from 'react-router-dom';
import { thumbnailUrl, startJob, getJobStatus } from '../api';
import { analyzeFrame, toImageData } from '../logic/centroid';
import FrameCanvas from '../components/FrameCanvas';
import ColorPicker from '../components/ColorPicker';
import JobStatus from '../components/JobStatus';

export default function VideoDetail() {
  const { filename } = useParams();

  // thumbnail pixels, tagged with the video they belong to
  const [loaded, setLoaded] = useState(null); // { filename, frame } or { filename, error }

  // tuning settings
  const [color, setColor] = useState('#000000');
  const [threshold, setThreshold] = useState(50);
  const deferredColor = useDeferredValue(color);
  const deferredThreshold = useDeferredValue(threshold);

  // processing job
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // load the thumbnail and read its pixels once per video
  useEffect(() => {
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setLoaded({ filename, frame: ctx.getImageData(0, 0, c.width, c.height) });
    };
    img.onerror = () => {
      if (!cancelled) setLoaded({ filename, error: 'Could not load thumbnail.' });
    };
    img.src = thumbnailUrl(filename);

    return () => { cancelled = true; };
  }, [filename]);

  // results from a previous video count as "not loaded yet"
  const current = loaded?.filename === filename ? loaded : null;
  const frame = current?.frame ?? null;
  const error = current?.error ?? null;

  // rerun the Java-ported pipeline whenever color/threshold change
  const result = useMemo(() => {
    if (!frame) return null;
    const { binary, largest } = analyzeFrame(frame, deferredColor, deferredThreshold);
    return { binaryImage: toImageData(binary), centroid: largest ? largest.centroid : null };
  }, [frame, deferredColor, deferredThreshold]);

  // start a processing job
  async function handleProcess() {
    setSubmitting(true);
    setJob(null);
    try {
      const { jobId } = await startJob(filename, color, threshold);
      setJobId(jobId);
      setJob({ status: 'processing' });
    } catch (e) {
      setJob({ status: 'error', error: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  // poll the job's status until it's done or fails
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;

    const interval = setInterval(async () => {
      try {
        const status = await getJobStatus(jobId);
        if (cancelled) return;
        setJob(status);
        if (status.status !== 'processing') {
          clearInterval(interval);
          setJobId(null);
        }
      } catch (e) {
        if (cancelled) return;
        setJob({ status: 'error', error: e.message });
        clearInterval(interval);
        setJobId(null);
      }
    }, 1500);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [jobId]);

  return (
    <main>
      <Link to="/videos" className="back-link">← Back to videos</Link>
      <h1 className="page-title">Preview Processing</h1>
      <h2 className="subtitle">{filename}</h2>

      <div className="panel controls">
        <ColorPicker value={color} onChange={setColor} />
        <label>
          Threshold:
          <input
            type="range"
            min="0"
            max="442"
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
          />
          <span className="threshold-value">{threshold}</span>
        </label>
      </div>

      {error && <p className="status error">Error: {error}</p>}
      {!frame && !error && <p className="notice">Loading frame...</p>}

      {result && (
        <div className="panel">
          <div className="frames">
            <FrameCanvas
              imageData={frame}
              centroid={result.centroid}
              label="Original Frame (with centroid)"
            />
            <FrameCanvas
              imageData={result.binaryImage}
              centroid={result.centroid}
              label="Binarized Frame (with centroid)"
            />
          </div>
          {!result.centroid && <p className="notice">No pixels match this color/threshold.</p>}
        </div>
      )}

      <div className="panel">
        <button
          className="btn"
          onClick={handleProcess}
          disabled={submitting || jobId !== null}
        >
          Process Video with These Settings
        </button>
        <JobStatus job={job} />
      </div>
    </main>
  );
}