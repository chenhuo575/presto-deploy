import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import ErrorPopup from '../components/ErrorPopup';
import { getStore, putStore } from '../api';
import type { Presentation, Slide, Store } from '../types';

const PresentationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [showEditThumbnail, setShowEditThumbnail] = useState(false);

  const fetchPresentation = useCallback(async () => {
    try {
      const store = await getStore();
      const found = (store.presentations ?? []).find((p: Presentation) => p.id === id);
      if (!found) {
        setError('Presentation not found');
        return;
      }
      setPresentation(found);
      setEditTitleValue(found.name);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  const savePresentation = async (updated: Presentation) => {
    try {
      const store = await getStore();
      const newPresentations = (store.presentations ?? []).map((p: Presentation) =>
        p.id === updated.id ? updated : p
      );
      const newStore: Store = { ...store, presentations: newPresentations };
      await putStore(newStore);
      setPresentation(updated);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const store = await getStore();
      const newPresentations = (store.presentations ?? []).filter(
        (p: Presentation) => p.id !== id
      );
      await putStore({ ...store, presentations: newPresentations });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleSaveTitle = async () => {
    if (!presentation) return;
    await savePresentation({ ...presentation, name: editTitleValue });
    setShowEditTitle(false);
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !presentation) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      await savePresentation({ ...presentation, thumbnail: reader.result as string });
      setShowEditThumbnail(false);
    };
    reader.readAsDataURL(file);
  };


};

export default PresentationEdit;