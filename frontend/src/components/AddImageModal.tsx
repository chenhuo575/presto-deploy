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
    src: string;
}


const AddTextModal: React.FC<AddImageModalProps> = ({ open, onClose, onSubmit }) => {
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

}

export default AddTextModal;