import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getStore } from '../api';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import type { Presentation, SlideElement, SlideBackground } from '../types';

const PreviewPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const slideIndex = parseInt(searchParams.get('slide') || '0', 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await getStore();
        const pres = store.presentations?.find((p: Presentation) => p.id === id);
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

  const defaultBg: SlideBackground = presentation.defaultBackground ?? { type: 'solid', color: '#ffffff' };
  const bg: SlideBackground = currentSlide.background ?? defaultBg;
  let backgroundStyle: React.CSSProperties = {};
  if (bg.type === 'solid') {
    backgroundStyle = { backgroundColor: bg.color || '#ffffff' };
  } else if (bg.type === 'gradient') {
    backgroundStyle = { background: `linear-gradient(to right, ${bg.gradientStart ?? '#fff'}, ${bg.gradientEnd ?? '#ccc'})` };
  } else if (bg.type === 'image') {
    backgroundStyle = { backgroundImage: `url(${bg.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{
          width: '100%', height: '100%', position: 'relative',
          ...backgroundStyle,
        }}>
          {(currentSlide.elements || []).map((el: SlideElement, i: number) => {
            const posStyle: React.CSSProperties = {
              position: 'absolute',
              left: `${el.x ?? 0}%`,
              top: `${el.y ?? 0}%`,
              width: `${el.width ?? 10}%`,
              height: `${el.height ?? 10}%`,
              overflow: 'auto',
              border: 'none',
              zIndex: el.layer ?? i,
            };

            if (el.type === 'text') {
              return (
                <div key={el.id} style={{ ...posStyle, fontSize: `${el.fontSize || 1}em`, color: el.color || '#000', fontFamily: el.fontFamily || 'inherit', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                  {el.text}
                </div>
              );
            }
            if (el.type === 'image') {
              return (
                <div key={el.id} style={{ ...posStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={el.src} alt={el.alt || ''} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              );
            }
            if (el.type === 'video') {
              return (
                <div key={el.id} style={posStyle}>
                  <iframe src={`${el.url}${el.autoPlay ? '?autoplay=1' : ''}`} style={{ width: '100%', height: '100%', border: 'none' }} allow="autoplay" title="video" />
                </div>
              );
            }
            if (el.type === 'code') {
              const highlighted = hljs.highlightAuto(el.code || '', ['javascript', 'python', 'c']).value;
              return (
                <div key={el.id} style={{ ...posStyle, fontSize: `${el.fontSize || 1}em`, whiteSpace: 'pre', fontFamily: 'monospace', backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: 8, overflow: 'auto' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace' }}>
                    <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                  </pre>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, padding: 12, backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <button
          onClick={() => goTo(slideIndex - 1)}
          disabled={slideIndex <= 0}
          style={{ fontSize: 24, padding: '4px 16px', cursor: slideIndex <= 0 ? 'not-allowed' : 'pointer', opacity: slideIndex <= 0 ? 0.3 : 1 }}
          aria-label="Previous slide"
        >◀
        </button>
        <span style={{ color: '#fff', fontSize: 16 }}>Slide {slideIndex + 1} / {totalSlides}</span>
        <button
          onClick={() => goTo(slideIndex + 1)}
          disabled={slideIndex >= totalSlides - 1}
          style={{ fontSize: 24, padding: '4px 16px', cursor: slideIndex >= totalSlides - 1 ? 'not-allowed' : 'pointer', opacity: slideIndex >= totalSlides - 1 ? 0.3 : 1 }}
          aria-label="Next slide"
        >▶
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;