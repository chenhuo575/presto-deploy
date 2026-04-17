import React, { useState, useEffect } from 'react';
import type { ImageElement } from '../types';

interface EditImageModalProps {
    element: ImageElement | null;
    onClose: () => void;
    onSubmit: (_element: ImageElement) => void;
}

const EditImageModal: React.FC<EditImageModalProps> = ({ element, onClose, onSubmit }) => {
  const [width, setWidth] = useState(25);
  const [height, setHeight] = useState(25);
  const [alt, setAlt] = useState('');
  const [src, setSrc] = useState('');
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [useFile, setUseFile] = useState(false);


  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (element) {
      setWidth(element.width);
      setHeight(element.height);
      setAlt(element.alt);
      setSrc(element.src);
      setX(element.x);
      setY(element.y);
      setUseFile(element.src.startsWith('data:'));
    }
  }, [element]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!element) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
    
  const handleSubmit = () => {
    onSubmit({
      ...element,
      x,
      y,
      width,
      height,
      alt,
      src,
    });
    onClose();
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
      <div style={{background:'white', padding: '24px', borderRadius: '8px', minWidth: '350px',color:'#000'   }}>
        <h3>Edit Image</h3>
        <label>Width (%)</label>
        <input type="number" min={1} max={100} value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{width:'100%',padding:'6px', marginBottom:'8px'}} />
        <label>Height (%)</label>
        <input type="number" min={1} max={100} value={height} onChange={(e) => setHeight(Number(e.target.value))} style={{width:'100%',padding:'6px', marginBottom:'8px'}} />
        <label>Position X (%)</label>
        <input type="number" min={0} max={100} value={x} onChange={(e) => setX(Number(e.target.value))} style={{width:'100%',padding:'6px', marginBottom:'8px'}} />
        <label>Position Y (%)</label>
        <input type="number" min={0} max={100} value={y} onChange={(e) => setY(Number(e.target.value))} style={{width:'100%',padding:'6px', marginBottom:'8px'}} />
        <div style={{marginBottom:'8px'}}>
          <label>
            <input type="checkbox" checked={useFile} onChange={(e) => setUseFile(e.target.checked)} />
            {' '}Upload from file
          </label>
        </div>
        {useFile ? (
          <input type="file" accept="image/*" onChange={handleFileChange} style={{display:'block', marginBottom:'8px'}} />
        ) : (
          <>
            <label>Image URL</label>
            <input type="text" value={src} onChange={(e) => setSrc(e.target.value)} style={{width:'100%',padding:'6px', marginBottom:'8px'}} />
          </>
        )}
        <label>Alt Text</label>
        <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} style={{width:'100%',padding:'6px', marginBottom:'12px'}} />
        <div style={{display:'flex', gap:'8px',justifyContent:'flex-end'}}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditImageModal;