import React, { useState} from 'react';

interface AddTextModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (text: string) => void;
}

export interface TextDate{
    width: number;
    height: number;
    text: string;
    fontSize: number;
    color: string;
}

const AddTextModal: React.FC<AddTextModalProps> = ({ open, onClose, onAdd }) => {
    const [text, setText] = useState('');
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [fontSize, setFontSize] = useState(0);
    const [color, setColor] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (width < 0 || width > 100 || height < 0 || height > 100 ){
            alert('Width and height must be between 0 and 100');
            return;
        }

        onAdd({ width, height, text, fontSize, color });

        setWidth(25);
        setHeight(25);
        setText('');
        setFontSize(1);
        setColor('#000000');
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
                <form onSubmit={handleSubmit}>

                </form>
            </div>
        </div>
    )
}