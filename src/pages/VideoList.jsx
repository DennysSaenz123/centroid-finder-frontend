import { useEffect, useState } from 'react';
import { getVideos } from '../api';

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVideos().then(setVideos).catch(e => setError(e.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  return <ul>{videos.map(v => <li key={v}>{v}</li>)}</ul>;
}