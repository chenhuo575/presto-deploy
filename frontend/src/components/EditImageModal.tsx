import React, { useState, useEffect } from 'react';
import type { ImageElement } from '../types';

interface EditImageModalProps {
    element: ImageElement | null;
    onClose: () => void;
    onSubmit: (element: ImageElement) => void;
}

const EditImageModal: React.FC<EditImageModalProps> = ({ element, onClose, onSubmit }) => {
    const [width, setWidth] = useState(25);
    const [height, setHeight] = useState(25);
    const [alt, setAlt] = useState('');
    const [src, setSrc] = useState('');
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [useFile, setUseFile] = useState(false);


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
    }
}