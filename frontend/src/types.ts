export interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'video' | 'code';
    position: { x: number; y: number };
    size: { width: number; height: number };
    [key: string]: unknown;
}

export interface Slide {
  id: string;
  elements: unknown[];
}

export interface Presentation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  slides: Slide[];
}

export interface Store {
  presentations: Presentation[];
}