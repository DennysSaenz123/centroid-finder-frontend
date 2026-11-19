import { useRef, useState } from 'react';
import { uploadVideo } from '../api';

export default function UploadButton({ onUploaded }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadVideo(file);
      onUploaded();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  }

  return (
    <div className="panel">
      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mkv"
        onChange={handleChange}
        hidden
      />
      <button className="btn" onClick={() => inputRef.current.click()} disabled={uploading}>
        {uploading ? 'Uploading…' : 'Upload Video'}
      </button>
      {error && <p className="status error">Error: {error}</p>}
    </div>
  );
}