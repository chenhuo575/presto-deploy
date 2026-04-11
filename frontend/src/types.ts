export interface Slide {
  id: string;
  elements: SlideElement[];
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

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  color: string;
  layer: number;
}

export type SlideElement = TextElement;