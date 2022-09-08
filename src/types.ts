export interface Image {
    id: string;
    url: string;
    short_url: string;
    views: number;
    favorites: number;
    source: string;
    purity: string;
    category: string;
    dimension_x: number;
    dimension_y: number;
    resolution: string;
    ratio: string;
    file_size: number;
    file_type: string;
    created_at: Date;
    colors: string[];
    path: string;
    thumbs: Thumb;
}

export interface Thumb {
    large: string;
    original: string;
    small: string;
}

export interface WallhavenApiResponse {
    data: Image[]
}
