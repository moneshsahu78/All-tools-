
import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { Tool } from '../../types';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { generateImage } from '../../services/geminiService';

export const ImageGenerationTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setError('');
        setImageUrl('');
        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (err) {
            setError('Failed to generate image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolContainer toolName={Tool.IMAGE_GENERATION}>
            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., An astronaut riding a horse on Mars, photorealistic."
                    className="w-full p-2 h-24 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                />
                <Button onClick={handleSubmit} disabled={loading || !prompt.trim()}>
                    Generate Image
                </Button>

                {loading && <Loader />}
                {error && <p className="text-red-500">{error}</p>}
                {imageUrl && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                         <h3 className="text-lg font-semibold mb-2 text-white">Result:</h3>
                        <img src={imageUrl} alt="Generated" className="rounded-md max-w-full h-auto mx-auto" style={{maxWidth: '512px'}} />
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};
