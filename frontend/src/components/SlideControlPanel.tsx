import React from 'react';

interface SlideControlPanelProps {
    slides: Array<unknown>;
    currentSlideIndex: number;
    onSelectSlide: (index: number) => void;
    onClose: () => void;
}

const SlideControlPanel: React.FC<SlideControlPanelProps> = ({ slides, currentSlideIndex, onSelectSlide, onClose }) => {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: 24, maxHeight: '80vh', overflowY: 'auto', width: '80%', maxWidth: 800 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h2>Slide Control Panel</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12}}>
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => { onSelectSlide(index); onClose(); }}
                            style={{
                                width: 150, height: 75,
                                border: index === currentSlideIndex ? '3px solid #1976d2' : '2px solid #ccc',
                                borderRadius: 4, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: index === currentSlideIndex ? '#e3f2fd' : '#fafafa',
                            }}
                        >
                        Slide {index + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default SlideControlPanel;