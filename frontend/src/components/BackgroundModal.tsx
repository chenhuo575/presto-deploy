import { useState, useEffect, type ChangeEvent  } from 'react';
import type { SlideBackground } from '../types';

interface BackgroundModalProps {
    open: boolean;
    onClose: () => void;
    currentSlideBackground?: SlideBackground;
    defaultBackground?: SlideBackground;
    onApplyToSlide: (_bg: SlideBackground | undefined) => void;
    onApplyDefault: (_bg: SlideBackground) => void;
}

const BackgroundModal = ({ open, onClose, currentSlideBackground, defaultBackground, onApplyToSlide, onApplyDefault }: BackgroundModalProps) => {
  const [tab, setTab] = useState<'slide' | 'default'>('slide');
  const [slideType, setSlideType] = useState<'solid' | 'gradient' | 'image'>('solid');
  const [slideColor, setSlideColor] = useState('#ffffff');
  const [slideGradStart, setSlideGradStart] = useState('#ffffff');
  const [slideGradEnd, setSlideGradEnd] = useState('#000000');
  const [slideImage, setSlideImage] = useState('');

  const [defType, setDefType] = useState<'solid' | 'gradient' | 'image'>('solid');
  const [defColor, setDefColor] = useState('#ffffff');
  const [defGradStart, setDefGradStart] = useState('#ffffff');
  const [defGradEnd, setDefGradEnd] = useState('#000000');
  const [defImage, setDefImage] = useState('');

  const [slideHasCustom, setSlideHasCustom] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    if (currentSlideBackground) {
      setSlideHasCustom(true);
      setSlideType(currentSlideBackground.type);
      setSlideColor(currentSlideBackground.color ?? '#ffffff');
      setSlideGradStart(currentSlideBackground.gradientStart ?? '#ffffff');
      setSlideGradEnd(currentSlideBackground.gradientEnd ?? '#000000');
      setSlideImage(currentSlideBackground.image ?? '');
    } else {
      setSlideHasCustom(false);
      setSlideType('solid');
      setSlideColor('#ffffff');
    }
    if (defaultBackground) {
      setDefType(defaultBackground.type);
      setDefColor(defaultBackground.color ?? '#ffffff');
      setDefGradStart(defaultBackground.gradientStart ?? '#ffffff');
      setDefGradEnd(defaultBackground.gradientEnd ?? '#000000');
      setDefImage(defaultBackground.image ?? '');
    } else {
      setDefType('solid');
      setDefColor('#ffffff');
    }
  }, [open, currentSlideBackground, defaultBackground]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!open) return null;

  const handleFileUpload = (setter: (_v: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const buildBg = (type: string, color: string, gs: string, ge: string, img: string): SlideBackground => {
    if (type === 'solid') return { type: 'solid', color };
    if (type === 'gradient') return { type: 'gradient', gradientStart: gs, gradientEnd: ge };
    return { type: 'image', image: img };
  };

  const renderFields = (
    type: string, setType: (_v: 'solid'|'gradient'|'image') => void,
    color: string, setColor: (_v: string) => void,
    gs: string, setGs: (_v: string) => void,
    ge: string, setGe: (_v: string) => void,
    img: string, setImg: (_v: string) => void,
  ) => (
    <div>
      <div style={{ marginBottom: '12px'}}>
        <label>Type:</label>
        <select value={type} onChange={(e)=> setType(e.target.value as 'solid' | 'gradient'|'image')}>
          <option value="solid">Solid Color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </select>
      </div>
      {type === 'solid' && (
        <div style={{ marginBottom: '12px' }}>
          <label>Colour: </label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} style={{ marginLeft: '8px', width: '100px' }} />
        </div>
      )}
      {type === 'gradient' && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label>Start Colour: </label>
            <input type="color" value={gs} onChange={(e) => setGs(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>End Colour: </label>
            <input type="color" value={ge} onChange={(e) => setGe(e.target.value)} />
          </div>
        </>
      )}
      {type === 'image' && (
        <div style={{ marginBottom: '12px' }}>
          <label>Image URL: </label>
          <input type="text" value={img} onChange={(e) => setImg(e.target.value)} style={{ width: '100%', padding: '6px', marginBottom: '8px' }} />
          <label>Or upload: </label>
          <input type="file" accept="image/*" onChange={handleFileUpload(setImg)} />
        </div>
      )}
    </div>
  )

  const handleSaveSlide = () => {
    if (!slideHasCustom) {
      onApplyToSlide(undefined);
    } else {
      onApplyToSlide(buildBg(slideType, slideColor, slideGradStart, slideGradEnd, slideImage));
    }
    onClose();
  };

  const handleSaveDefault = () => {
    onApplyDefault(buildBg(defType, defColor, defGradStart, defGradEnd, defImage));
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', color: '#000', minWidth: '400px', maxHeight: '80vh', overflow: 'auto' }}>
        <h3>Theme & Background</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => setTab('slide')} style={{ fontWeight: tab === 'slide' ? 'bold' : 'normal' }}>Current Slide</button>
          <button onClick={() => setTab('default')} style={{ fontWeight: tab === 'default' ? 'bold' : 'normal' }}>Default Background</button>
        </div>
            
        {tab === 'slide' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label>
                <input type="checkbox" checked={slideHasCustom} onChange={(e) => setSlideHasCustom(e.target.checked)} />
                {' '}Override default for this slide
              </label>
            </div>
            {slideHasCustom && renderFields(slideType, setSlideType, slideColor, setSlideColor, slideGradStart, setSlideGradStart, slideGradEnd, setSlideGradEnd, slideImage, setSlideImage)}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSaveSlide}>Apply to Slide</button>
            </div>
          </>
        )}
        {tab === 'default' && (
          <>
            {renderFields(defType, setDefType, defColor, setDefColor, defGradStart, setDefGradStart, defGradEnd, setDefGradEnd, defImage, setDefImage)}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSaveDefault}>Apply to Default</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BackgroundModal;