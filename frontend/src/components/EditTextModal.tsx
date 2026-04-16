import React, { useState, useEffect } from 'react';
import type { TextElement } from '../types';

interface EditTextModalProps {
    element: TextElement | null;
    onClose: () => void;
    onSubmit: (element: TextElement) => void;
}

const FONT_OPTIONS = ['Arial', 'Times New Roman', 'Courier New'];

const EditTextModal: React.FC<EditTextModalProps> = ({ element, onClose, onSubmit }) => {
    const [text, setText] = useState('');
    const [width, setWidth] = useState(25);
    const [height, setHeight] = useState(25);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(1);
    const [color, setColor] = useState('#000000');
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        if (element) {
            setText(element.text);
            setWidth(element.width);
            setHeight(element.height);
            setFontSize(element.fontSize);
            setColor(element.color);
            setFontFamily(element.fontFamily || 'Arial');
            setX(element.x);
            setY(element.y);
        }
    }, [element]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!element) return;

        onSubmit({
            ...element,
            x,
            y,
            width,
            height,
            text,
            fontSize,
            color,
            fontFamily,
            });
            onClose();
        };
        if (!element) return null;
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
                        padding: '20px',
                        borderRadius: '8px',
                        minWidth: '400px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        color: '#000',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2>Edit Text Element</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label>
                                Position X (%):
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={x}
                                    onChange={(e) => setX(Number(e.target.value))}
                                    style={{ marginLeft: '8px', width: '80px' }}
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>
                                Position Y (%):
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={y}
                                    onChange={(e) => setY(Number(e.target.value))}
                                    style={{ marginLeft: '8px', width: '80px' }}
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>
                                Width (%):
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={width}
                                    onChange={(e) => setWidth(Number(e.target.value))}
                                    style={{ marginLeft: '8px', width: '80px' }}
                                />
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
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    style={{ marginLeft: '8px', width: '80px' }}
                                />
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
                                    style={{ marginLeft: '8px', width: '80px' }}
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label>
                                Color:
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    style={{ marginLeft: '8px' }}
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    style={{ marginLeft: '8px', width: '100px' }}
                                />
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end' ,gap: '8px'}}>
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        );
};

export default EditTextModal;