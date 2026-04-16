export interface Slide {
  id: string;
  elements: SlideElement[];
}

export interface SlideBackground{
  type: 'solid' | 'gradient' | 'image';
  color?: string;
  gradientStart?: string;
  gradientEnd?: string;
  image?: string;
}

export interface Presentation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  defaultBackground?: SlideBackground;
  slides: Slide[];
}

export interface Store {
  presentations: Presentation[];
}

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  layer: number;
}

export interface ImageElement {
  id: string;
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  alt: string;
  layer: number;
}

export interface VideoElement{
  id: string;
  type: 'video';
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
  autoPlay: boolean;
  layer: number;
}

export interface CodeElement {
  id: string;
  type: 'code';
  x: number;
  y: number;
  width: number;
  height: number;
  code: string;
  fontSize: number;
  layer: number;
}

export type SlideElement = TextElement | ImageElement | VideoElement | CodeElement;