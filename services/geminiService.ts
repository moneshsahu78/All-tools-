
import { GoogleGenAI, Type, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const startChat = () => {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [],
        config: {
            systemInstruction: 'You are a helpful and friendly chatbot.',
        },
    });
};

export const streamChat = (message: string) => {
    if (!chat) {
        startChat();
    }
    return chat!.sendMessageStream({ message });
};

export const generateText = async (prompt: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const generateJson = async (prompt: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the following request, generate a JSON object that fulfills it. Request: "${prompt}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    "response": {
                        type: Type.ARRAY,
                        description: "An array of items based on the user's prompt.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                "item": {
                                    type: Type.STRING,
                                    description: "A single item."
                                },
                                "description": {
                                    type: Type.STRING,
                                    description: "A brief description of the item."
                                }
                            }
                        }
                    }
                }
            },
        },
    });
    return response.text;
};

export const searchWeb = async (prompt: string): Promise<{ text: string; sources: any[] }> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, sources };
};


export const generateImage = async (prompt: string) => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
};

export const editImage = async (prompt: string, imageFile: File): Promise<{text: string | null, imageUrl: string | null}> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let resultText = null;
    let resultImageUrl = null;

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            resultText = part.text;
        } else if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            resultImageUrl = `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    return { text: resultText, imageUrl: resultImageUrl };
};

export const generateVideo = async (prompt: string) => {
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
            numberOfVideos: 1
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        return URL.createObjectURL(blob);
    }
    return null;
};
