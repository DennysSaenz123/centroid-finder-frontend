import { useCallback, useEffect, useState } from 'react';
import { getVideos } from '../api';
import VideoCard from '../components/VideoCard';
import UploadButton from '../components/UploadButton';

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVideos = useCallback(() => {
  return getVideos()
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Unexpected response from server');
      setVideos(data);
      setError(null); // clear any old error once a load succeeds
    })
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
  }, []);

useEffect(() => { loadVideos(); }, [loadVideos]);

  useEffect(() => { loadVideos(); }, [loadVideos]);

  return (
    <main>
      <h1 className="page-title">Video Chooser</h1>
      <p className="subtitle">Pick a video to preview and process.</p>

      <UploadButton onUploaded={loadVideos} />

      {loading && <p className="notice">Loading videos...</p>}
      {error && <p className="status error">Error: {error}</p>}
      {!loading && !error && videos.length === 0 && <p className="notice">No videos found.</p>}

      <ul className="video-grid">
        {videos.map(v => (
          <li key={v}><VideoCard filename={v} /></li>
        ))}
      </ul>
    </main>
  );
}