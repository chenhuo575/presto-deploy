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
    onSubmit: (data: CodeData) => void;
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

    );
}

export default AddCodeModal;