import { useState, useEffect } from 'react';
import type { SlideBackground } from '../types';

interface BackgroundModalProps {
    open: boolean;
    onClose: () => void;
    currentSlideBackground?: SlideBackground;
    defaultBackground?: SlideBackground;
    onApplyToSlide: (bg: SlideBackground | undefined) => void;
    onApplyDefault: (bg: SlideBackground) => void;
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

  if (!open) return null;

  const handleFileUpload = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
}