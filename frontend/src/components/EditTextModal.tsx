import React, { useState, useEffect } from 'react';
import { TextElement } from '../types';

interface EditTextModalProps {
    open: boolean;
    element: TextElement | null;
    onClose: () => void;
    onSave: (element: TextElement) => void;
}

const EditTextModal: React.FC<EditTextModalProps> = ({ open, element, onClose, onSave }) => {
    const [text, setText] = useState<string>('');
    const [width, setWidth] = useState<number>(25);
    const [height, setHeight] = useState<number>(25);
    const [fontSize, setFontSize] = useState<number>(1);
    const [color, setColor] = useState<string>('#000000');
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);

    useEffect(() => {
        if (element) {
            setText(element.text);
            setWidth(element.width);
            setHeight(element.height);
            setFontSize(element.fontSize);
            setColor(element.color);
            setX(element.x);
            setY(element.y);
        }
    }, [element]);

    const hadleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!element) return;

        onSave({
            ...element,
            x,
            y,
            width,
            height,
            text,
            fontSize,
            color,
        })
        onClose();

        if (!open || !element) return null;
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
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2>Edit Text Element</h2>

                </div>
            </div>
        );
    }
}