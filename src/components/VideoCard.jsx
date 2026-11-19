import { Link } from 'react-router-dom';
import { thumbnailUrl } from '../api';

export default function VideoCard({ filename }) {
  return (
    <Link to={`/preview/${encodeURIComponent(filename)}`} className="video-card">
      <img
        src={thumbnailUrl(filename)}
        alt={`Thumbnail for ${filename}`}
        loading="lazy"
        width="240"
      />
      <p>{filename}</p>
    </Link>
  );
}