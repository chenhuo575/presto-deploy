import React, { useState} from 'react';

interface AddImageModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (_data: ImageData) => void;
}

export interface ImageData{
    width: number;
    height: number;
    alt: string;
    src: string;
}


const AddImageModal: React.FC<AddImageModalProps> = ({ open, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState(25);
  const [height, setHeight] = useState(25);
  const [alt, setAlt] = useState('');
  const [useFile, setUseFile] = useState(false);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if(!url.trim()) return;
    onSubmit({ width, height, alt, src:url });
    setUrl('');
    setWidth(25);
    setHeight(25);
    setAlt('');
    setUseFile(false);
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed',top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
      }}>
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', color: '#000', minWidth: '350px' }}>
        <h3>Add Image</h3>
        <label>Width (%):</label>
        <input type="number" value={width} min={1} max={100} onChange={(e) => setWidth(Number(e.target.value))}
          style={{width:'100%',padding:'6px', marginBottom:'8px'}}
        />
        <label>Height (%):</label>
        <input type="number" value={height} min={1} max={100} onChange={(e) => setHeight(Number(e.target.value))} 
          style={{width:'100%',padding:'6px', marginBottom:'8px'}}
        />
        <div style={{ marginBottom: '8px' }}>
          <label>
            <input type="checkbox" checked={useFile} onChange={(e) => setUseFile(e.target.checked)} />
            {' '}Upload from file
          </label>
        </div>
        {useFile ? (
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '8px', display: 'block' }} />
        ) : (
          <>
            <label>Image URL</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.png" style={{ width: '100%', padding: '6px', marginBottom: '8px' }} />
          </>
        )}
        <label>Alt Text</label>
        <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Image description" style={{ width: '100%', padding: '6px', marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '8px',justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default AddImageModal;