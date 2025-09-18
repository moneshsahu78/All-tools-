
export enum Tool {
    CHATBOT = 'Chatbot',
    TEXT_GENERATION = 'Text Generation',
    JSON_GENERATOR = 'JSON Generator',
    WEB_SEARCH = 'Web Search',
    IMAGE_GENERATION = 'Image Generation',
    IMAGE_EDITOR = 'Image Editor',
    VIDEO_GENERATION = 'Video Generation',
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}
