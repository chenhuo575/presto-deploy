import { useState } from 'react';

export interface VideoData {
    url: string;
    autoPlay: boolean;
    width: number;
    height: number;
}

interface AddVideoModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (_data: VideoData) => void;
}

const AddVideoModal = ({ open, onClose, onSubmit }: AddVideoModalProps) => {
  const [url, setUrl] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);

  if (!open) return null;

  const handleSubmit = () => {
    if (!url.trim()) return;
    onSubmit({ url, autoPlay, width, height });
    setWidth(50);
    setHeight(50);
    setUrl('');
    setAutoPlay(false);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', color: 'black', minWidth: '350px' }}>
        <h3>Add Video</h3>
        <div style={{ marginBottom: '12px' }}>
          <label>Width (%): </label>
          <input
            type="number"
            value={width}
            min={1}
            max={100}
            onChange={(e) => setWidth(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Height (%): </label>
          <input
            type="number"
            value={height}
            min={1}
            max={100}
            onChange={(e) => setHeight(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Video URL: </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>
            <input
              type="checkbox"
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
            />
            {' '}Auto Play
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default AddVideoModal;