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