
import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { Tool } from '../../types';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { searchWeb } from '../../services/geminiService';

interface Source {
    web?: {
        uri: string;
        title: string;
    }
}

export const WebSearchTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<{ text: string; sources: Source[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await searchWeb(prompt);
            setResult(response);
        } catch (err) {
            setError('Failed to perform web search. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolContainer toolName={Tool.WEB_SEARCH}>
            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Who won the latest Formula 1 race?"
                    className="w-full p-2 h-32 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                />
                <Button onClick={handleSubmit} disabled={loading || !prompt.trim()}>
                    Search
                </Button>

                {loading && <Loader />}
                {error && <p className="text-red-500">{error}</p>}
                {result && (
                    <div className="p-4 bg-gray-800 rounded-lg space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Answer:</h3>
                            <p className="text-gray-300 whitespace-pre-wrap">{result.text}</p>
                        </div>
                        {result.sources.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-white">Sources:</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.sources.filter(s => s.web).map((source, index) => (
                                        <li key={index}>
                                            <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                                {source.web!.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};
