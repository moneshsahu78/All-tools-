
import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { Tool } from '../../types';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { generateText } from '../../services/geminiService';

export const TextGenerationTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setError('');
        setResult('');
        try {
            const text = await generateText(prompt);
            setResult(text);
        } catch (err) {
            setError('Failed to generate text. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolContainer toolName={Tool.TEXT_GENERATION}>
            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Write a short story about a robot who discovers music."
                    className="w-full p-2 h-32 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                />
                <Button onClick={handleSubmit} disabled={loading || !prompt.trim()}>
                    Generate Text
                </Button>

                {loading && <Loader />}
                {error && <p className="text-red-500">{error}</p>}
                {result && (
                    <div className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-white">Result:</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};
