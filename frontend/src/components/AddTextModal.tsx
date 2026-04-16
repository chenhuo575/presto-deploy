import React, { useState} from 'react';

interface AddTextModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TextData) => void;
}

export interface TextData{
    width: number;
    height: number;
    text: string;
    fontSize: number;
    color: string;
    fontFamily: string;
}

const FONT_OPTIONS = ['Arial', 'Times New Roman', 'Courier New'];

const AddTextModal: React.FC<AddTextModalProps> = ({ open, onClose, onSubmit }) => {
    const [text, setText] = useState('');
    const [width, setWidth] = useState(25);
    const [height, setHeight] = useState(25);
    const [fontSize, setFontSize] = useState(1);
    const [color, setColor] = useState('#000000');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (width < 0 || width > 100 || height < 0 || height > 100 ){
            setError('Width and height must be between 0 and 100');
            return;
        }

    onSubmit({ width, height, text, fontSize, color, fontFamily });
        setWidth(25);
        setHeight(25);
        setText('');
        setFontSize(1);
        setColor('#000000');
        setFontFamily('Arial');
        setError('');
        onClose();
    };

    if (!open) return null;

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
            onClick={onClose}
            >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '8px',
                    minWidth: '400px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Add Text box</h2>
                {error && (
                    <div style={{ 
                        color: 'red', 
                        marginBottom: '16px',
                        padding: '8px',
                        backgroundColor: '#ffe6e6',
                        borderRadius: '4px',
                    }}>
                        {error}
                        <button 
                        onClick={() => setError('')}
                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                        >
                        ✕
                        </button>
                    </div>
                    )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label>      
                            Width (%):
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}/>
                        </label>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label>
                            Height (%):
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}/>
                        </label>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label>
                        Text:
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ 
                            display: 'block',
                            width: '100%',
                            height: '80px',
                            marginTop: '8px',
                            }}
                        />
                        </label>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label>
                            Font Size (em):
                            <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                style={{ marginLeft: '8px', width:'80px'}}/>
                        </label>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label>
                            Color:
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{ marginLeft: '8px' }}/>
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{ marginLeft: '8px', width:'100px' }}/>
                        </label>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label>
                            Font Family:
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                style={{ marginLeft: '8px' }}
                            >
                                {FONT_OPTIONS.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end',
                    }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTextModal;