
import React from 'react';
import { Tool } from './types';
import { ChatIcon } from './components/icons/ChatIcon';
import { TextIcon } from './components/icons/TextIcon';
import { JsonIcon } from './components/icons/JsonIcon';
import { WebSearchIcon } from './components/icons/WebSearchIcon';
import { ImageIcon } from './components/icons/ImageIcon';
import { VideoIcon } from './components/icons/VideoIcon';

export const TOOLS = [
    {
        name: Tool.CHATBOT,
        description: 'Engage in a conversation with a powerful AI.',
        icon: <ChatIcon />,
    },
    {
        name: Tool.TEXT_GENERATION,
        description: 'Generate creative text from a simple prompt.',
        icon: <TextIcon />,
    },
    {
        name: Tool.JSON_GENERATOR,
        description: 'Create structured JSON data based on a description.',
        icon: <JsonIcon />,
    },
    {
        name: Tool.WEB_SEARCH,
        description: 'Get up-to-date answers grounded in web search results.',
        icon: <WebSearchIcon />,
    },
    {
        name: Tool.IMAGE_GENERATION,
        description: 'Create stunning images from text prompts.',
        icon: <ImageIcon />,
    },
    {
        name: Tool.IMAGE_EDITOR,
        description: 'Upload an image and edit it using text commands.',
        icon: <ImageIcon />,
    },
    {
        name: Tool.VIDEO_GENERATION,
        description: 'Generate a short video clip from a text prompt.',
        icon: <VideoIcon />,
    },
];
