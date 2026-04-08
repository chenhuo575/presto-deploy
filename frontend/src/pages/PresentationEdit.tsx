import {useParams, useNavigate} from 'react-router-dom';
import { useState, useEffect, useCallback} from 'react';
import ErrorPopup from '../components/ErrorPopup';
import { getStore, putStore } from '../api';
import type { Presentation, Slide } from '../types';

const PresentationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [error, setError] = useState('');
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [editTitelleValue, setEditTitleValue] = useState('');
    const [showEditThumbnail, setShowEditThumbnail] = useState(false);

    const generateId = (): string =>{
        return `${Date.now()}-${Math.random().toString(16).slice(2,9)}`;
    };

    const fetchPresentation = useCallback(async () => {
        try {
            const store = await getStore();
            const found = store.presentations.find(p => p.id === id);
            if (!found) {
                setError('Presentation not found');
                return;
            }
            setPresentation(found);
            setEditTitleValue(found.name);
        } catch (err) {
            setError('Failed to load presentation');
        }
    }, [id]);

    useEffect(() => {
        fetchPresentation();
    }, [fetchPresentation]);

    const savePresentation = async (updated: Presentation) => {
        try {
            const store =await getStore();
            const newPresentations = store.presentations.map(p => p.id === updated.id ? updated : p);
            await putStore({ ...store,presentations: newPresentations });
            setPresentation(updated);
        } catch (err) {
            setError('Failed to save presentation');
        }
    };

    const handleDeletePresentation = async() => {
        try{
            const store = await getStore();
            const filtered = store.presentations.filter((p) => p.id !== presentation?.id);
            await putStore({ ...store, presentations: filtered });
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to delete presentation');
        }
    }

    const handleSaveTitle = async () =>{
        if (!presentation) return;
        const trimed = editTitelleValue.trim();
        if (!trimed) {
            setError('Title cannot be empty');
            return;
        }
        await savePresentation({ ...presentation, name: trimed });
        setShowEditTitle(false);
    }

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const file= e.target.files?.[0];
        if(!file||!presentation) return;
        const reader = new FileReader();
        reader.onloadend = async () =>{
            await savePresentation({ ...presentation, thumbnail: reader.result as string });
            setShowEditThumbnail(false);
        };
        reader.readAsDataURL(file);
    }

}