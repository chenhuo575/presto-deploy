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


};

export default EditCodeModal;