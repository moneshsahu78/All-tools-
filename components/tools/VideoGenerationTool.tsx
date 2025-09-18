import React, { useState, useEffect } from 'react';
import { ToolContainer } from './ToolContainer';
import { Tool } from '../../types';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { generateVideo } from '../../services/geminiService';

const LOADING_MESSAGES = [
    "Initializing video generation...",
    "The AI is dreaming up your video...",
    "Rendering the first few frames...",
    "This can take a few minutes, hang tight!",
    "Assembling the final cut...",
    "Almost there, adding the finishing touches...",
];

export const VideoGenerationTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

    useEffect(() => {
        // FIX: Resolve NodeJS.Timeout type error by refactoring to a safer, browser-compatible effect pattern.
        // This also prevents a potential runtime error from calling clearInterval with an undefined value.
        if (loading) {
            const interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = LOADING_MESSAGES.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
                    return LOADING_MESSAGES[nextIndex];
                });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [loading]);

    const handleSubmit = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setError('');
        setVideoUrl(null);
        setLoadingMessage(LOADING_MESSAGES[0]);
        try {
            const url = await generateVideo(prompt);
            setVideoUrl(url);
        } catch (err) {
            setError('Failed to generate video. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolContainer toolName={Tool.VIDEO_GENERATION}>
            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A cinematic shot of a hummingbird flying in slow motion."
                    className="w-full p-2 h-24 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                />
                <Button onClick={handleSubmit} disabled={loading || !prompt.trim()}>
                    Generate Video
                </Button>

                {loading && <Loader message={loadingMessage} />}
                {error && <p className="text-red-500">{error}</p>}
                {videoUrl && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                         <h3 className="text-lg font-semibold mb-2 text-white">Result:</h3>
                        <video controls src={videoUrl} className="w-full rounded-md" />
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};
