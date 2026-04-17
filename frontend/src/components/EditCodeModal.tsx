import { useState, useEffect } from 'react';
import type { CodeElement } from '../types';

interface EditCodeModalProps {
    element: CodeElement | null;
    onClose: () => void;
    onSubmit: (element: CodeElement) => void;
}

const EditCodeModal = ({ element, onClose, onSubmit }: EditCodeModalProps) => {
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState(1);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(30);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (element) {
      setCode(element.code);
      setFontSize(element.fontSize);
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
      code,
      fontSize,
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
                <h3>Edit Code Snippet</h3>
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
                    <label>Font Size (em): </label>
                    <input
                        type="number"
                        value={fontSize}
                        min={0.1}
                        max={10}
                        step={0.1}
                        onChange={(e) => setFontSize(Number(e.target.value))}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditCodeModal;