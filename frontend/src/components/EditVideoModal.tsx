import {useState, useEffect} from 'react';
import type {VideoElement} from '../types';

interface EditVideoModalProps {
    element: VideoElement | null;
    onClose: () => void;
    onSubmit: (element: VideoElement) => void;
}

const EditVideoModal= ({ element, onClose, onSubmit }: EditVideoModalProps) => {
  const [url, setUrl] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(50);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (element) {
      setUrl(element.url);
      setAutoPlay(element.autoPlay);
      setWidth(element.width);
      setHeight(element.height);
      setX(element.x);
      setY(element.y);
    }
  }, [element]);

  if (!element) return null;

  const handleSubmit = () => {
    onSubmit({
      ...element,
      url,
      autoPlay,
      width,
      height,
      x,
      y,
    });
    onClose();
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', color: 'black', minWidth: '350px' }}>
        <h3>Edit Video</h3>
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
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Position X (%): </label>
          <input
            type="number"
            value={x}
            min={0}
            max={100}
            onChange={(e) => setX(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Position Y (%): </label>
          <input
            type="number"
            value={y}
            min={0}
            max={100}
            onChange={(e) => setY(Number(e.target.value))}
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
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditVideoModal;