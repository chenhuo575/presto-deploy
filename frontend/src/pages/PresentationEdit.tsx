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

  const handleAddSlide = async () => {
    if (!presentation) return;
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      elements: [],
    };
    const updated = {
      ...presentation,
      slides: [...presentation.slides, newSlide],
    };
    await savePresentation(updated);
    setCurrentSlideIndex(updated.slides.length - 1);
  };

  const handleDeleteSlide = async () => {
    if (!presentation) return;
    if (presentation.slides.length <= 1) {
      setError('Cannot delete the only slide. Please delete the presentation instead.');
      return;
    }
    const newSlides = presentation.slides.filter((_, i) => i !== currentSlideIndex);
    await savePresentation({ ...presentation, slides: newSlides });
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!presentation) return;
      if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex((prev) => prev - 1);
      }
      if (e.key === 'ArrowRight' && currentSlideIndex < presentation.slides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation, currentSlideIndex]);

  if (!presentation) {
    return (
      <div>
        <p>Loading...</p>
        <ErrorPopup message={error} onClose={() => setError('')} />
      </div>
    );
  }

  const currentSlide = presentation.slides[currentSlideIndex];
  const totalSlides = presentation.slides.length;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={() => navigate('/dashboard')}>← Back</button>
        <button onClick={() => setShowDeleteConfirm(true)} style={{ color: 'red' }}>
          Delete Presentation
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>{presentation.name}</h2>
        <button onClick={() => setShowEditTitle(true)} style={{ fontSize: '0.8em' }}>✏️ Edit Title</button>
        <button onClick={() => setShowEditThumbnail(true)} style={{ fontSize: '0.8em' }}>🖼️ Thumbnail</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={handleAddSlide}>+ New Slide</button>
        <button onClick={handleDeleteSlide}>🗑️ Delete Slide</button>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          aspectRatio: '2 / 1',
          border: '2px solid #555',
          borderRadius: '8px',
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', height: '100%', padding: '16px' }}>
          <p style={{ color: '#999' }}>Slide content for: {currentSlide?.id}</p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '12px',
            fontSize: '0.85em',
            color: '#666',
          }}
        >
          {currentSlideIndex + 1}
        </div>

        {totalSlides > 1 && (
          <>
            <button
              onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
              disabled={currentSlideIndex === 0}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: currentSlideIndex === 0 ? 0.3 : 1,
                cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ◀
            </button>
            <button
              onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
              disabled={currentSlideIndex === totalSlides - 1}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: currentSlideIndex === totalSlides - 1 ? 0.3 : 1,
                cursor: currentSlideIndex === totalSlides - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ▶
            </button>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', color: '#000', textAlign: 'center' }}>
            <p>Are you sure?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleDelete}>Yes</button>
              <button onClick={() => setShowDeleteConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {showEditTitle && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', color: '#000', minWidth: '300px' }}>
            <h3>Edit Title</h3>
            <input
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowEditTitle(false)}>Cancel</button>
              <button onClick={handleSaveTitle}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showEditThumbnail && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', color: '#000', minWidth: '300px' }}>
            <h3>Update Thumbnail</h3>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            <div style={{ marginTop: '12px' }}>
              <button onClick={() => setShowEditThumbnail(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ErrorPopup message={error} onClose={() => setError('')} />
    </div>
  );
};

export default PresentationEdit;