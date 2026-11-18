import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import VideoList from './pages/VideoList';
import VideoDetail from './pages/VideoDetail';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/videos" replace />} />
        <Route path="/videos" element={<VideoList />} />
        <Route path="/preview/:filename" element={<VideoDetail />} />
        <Route path="*" element={<Navigate to="/videos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}