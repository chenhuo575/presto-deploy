import { useState } from 'react';

export interface CodeData {
    code: string;
    fontsize: number;
    width: number;
    height: number;
}

interface AddCodeModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (_data: CodeData) => void;
}

const AddCodeModal = ({ open, onClose, onSubmit }: AddCodeModalProps) => {
  const [code, setCode] = useState('');
  const [fontsize, setFontsize] = useState(1);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(30);

  if (!open) return null;

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit({ code, fontsize, width, height });
    setCode('');
    setFontsize(1);
    setWidth(50);
    setHeight(30);
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
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', color: 'black', minWidth: '400px' }}>
        <h3>Add Code Snippet</h3>
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
          <label>Font Size: </label>
          <input
            type="number"
            value={fontsize}
            min={0.1}
            max={10}
            step={0.1}
            onChange={(e) => setFontsize(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Code: </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code here..."
            style={{
              width: '100%',
              padding: '8px',
              minHeight: '150px',
              fontFamily: 'monospace',
              whiteSpace: 'pre',
              resize: 'vertical',
            }}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                    Language (C / Python / JavaScript) will be auto-detected.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default AddCodeModal;