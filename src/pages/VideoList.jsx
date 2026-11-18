import { useEffect, useState } from 'react';
import { getVideos } from '../api';
import VideoCard from '../components/VideoCard';

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVideos()
    .then(setVideos)
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
  }, []);
  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (videos.length === 0) return <p>No videos found.</p>;

  return (
    <main>
      <h1>Video Chooser</h1>
      <ul>
        {videos.map(v => (
          <li key={v}>
            <VideoCard filename={v} />
          </li>
        ))}
      </ul>
    </main>
  );
}