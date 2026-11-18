import { useEffect, useRef } from 'react';

export default function FrameCanvas({ imageData, centroid, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);

    // ring at the centroid of the largest group
    if (centroid) {
      const r = Math.max(4, Math.round(Math.min(imageData.width, imageData.height) / 50));
      ctx.beginPath();
      ctx.arc(centroid.x + 0.5, centroid.y + 0.5, r, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(2, r / 2.5);
      ctx.strokeStyle = '#22c55e';
      ctx.stroke();
    }
  }, [imageData, centroid]);

  return (
    <figure className="frame">
      <figcaption>{label}</figcaption>
      <canvas ref={canvasRef} aria-label={label} />
    </figure>
  );
}