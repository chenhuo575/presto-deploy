import React, { useEffect, useState, useCallback, use } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getStore } from '../api';

const PreviewPage: React.FC = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [presentation, setPresentation] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const slideIndex = parseInt(searchParams.get('slide') || '0', 10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const store = await getStore();
                const pres = store.presentations?.find((p: any) => p.id === id);
                if (!pres) {
                    setError('Presentation not found');
                    return;
                }
                setPresentation(pres);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
            }
        };
        fetchData();
    }, [id]);

    const slides = presentation?.slides || [];
    const totalSlides = slides.length;

    const goTo = useCallback((idx: number) => {
    if (idx >= 0 && idx < totalSlides) {
      setSearchParams({ slide: String(idx) });
    }
  }, [totalSlides, setSearchParams]);

  useEffect(() => {
    const handleKey=(e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goTo(slideIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        goTo(slideIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [slideIndex, goTo]);

    if (error) return <div style={{ color: 'white', padding: 32 }}>{error}</div>;
    if (!presentation) return <div style={{ color: 'white', padding: 32 }}>Loading...</div>;

    const currentSlide = slides[slideIndex];
    if (!currentSlide) return <div style={{ color: 'white', padding: 32 }}>No slides</div>;

    const defaultBg = presentation.defaultBackground || { type: 'solid', color: '#ffffff' };
    const bg = currentSlide.background || defaultBg;
    let backgroundStyle: React.CSSProperties = {};
    if (bg.type === 'solid') {
        backgroundStyle = { backgroundColor: bg.color || '#ffffff' };
    } else if (bg.type === 'gradient') {
        backgroundStyle = { background: bg.gradient || 'linear-gradient(to right, #fff, #ccc)' };
    } else if (bg.type === 'image') {
        backgroundStyle = { backgroundImage: `url(${bg.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }

    return (
        
    )
}