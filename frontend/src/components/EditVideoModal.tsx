import {useState, useEffect} from 'react';
import type {VideoElement} from '../types';

interface EditVideoModalProps {
    element: VideoElement | null;
    onClose: () => void;
    onSubmit: (element: VideoElement) => void;
}

const EditVideoModal= ({ element, onClose, onSubmit }: EditVideoModalProps) => {
    const [url, setUrl] = useState('');
    const [autoPlay, setAutoPlay] = useState(false);
    const [width, setWidth] = useState(50);
    const [height, setHeight] = useState(50);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        if (element) {
            setUrl(element.url);
            setAutoPlay(element.autoPlay);
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
            url,
            autoPlay,
            width,
            height,
            x,
            y,
        });
        onClose();
    };

    return (

    );
}

export default EditVideoModal;