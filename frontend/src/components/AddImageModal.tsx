import React, { useEffect, useState} from 'react';
import type { ImageElement } from '../types';

interface AddImageModalProps {
    element: ImageElement | null;
    onClose: () => void;
    onSubmit: (data: ImageData) => void;
}

export interface ImageData{
    width: number;
    height: number;
    alt: string;
    url: string;
}


const AddTextModal: React.FC<AddImageModalProps> = ({ element, onClose, onSubmit }) => {
    const [url, setUrl] = useState('');
    const [width, setWidth] = useState(25);
    const [height, setHeight] = useState(25);
    const [alt, setAlt] = useState('');
    const [error, setError] = useState('');
    const [src, setSrc] = useState('');
    const [useFile, setUseFile] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        if (element) {
            setWidth(element.width);
            setHeight(element.height);
            setAlt(element.alt);
            setUrl(element.src);
            setX(element.x);
            setY(element.y);
            setSrc(element.src);
        }
    }, [element]);

    if (!element) return null;

    const handleFileChange=(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
}

export default AddTextModal;