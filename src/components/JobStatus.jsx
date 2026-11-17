import { resultUrl } from '../api';

// job is null or { status: 'processing' | 'done' | 'error', result?, error? }
export default function JobStatus({ job }) {
  if (!job) return null;

  if (job.status === 'processing') {
    return <p className="job-status">Processing… this can take a while.</p>;
  }

  if (job.status === 'done') {
    return (
      <p className="job-status">
        Done!{' '}
        <a href={resultUrl(job.result)} target="_blank" rel="noreferrer">
          Download CSV
        </a>
      </p>
    );
  }

  return <p className="job-status error">Error: {job.error}</p>;
}