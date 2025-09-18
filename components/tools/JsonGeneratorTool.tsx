
import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { Tool } from '../../types';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { CodeBlock } from '../shared/CodeBlock';
import { generateJson } from '../../services/geminiService';

export const JsonGeneratorTool: React.FC = () => {
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
            const jsonString = await generateJson(prompt);
            const parsedJson = JSON.parse(jsonString);
            setResult(JSON.stringify(parsedJson, null, 2));
        } catch (err) {
            setError('Failed to generate valid JSON. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolContainer toolName={Tool.JSON_GENERATOR}>
            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A list of three programming languages with their creators."
                    className="w-full p-2 h-32 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                />
                <Button onClick={handleSubmit} disabled={loading || !prompt.trim()}>
                    Generate JSON
                </Button>

                {loading && <Loader />}
                {error && <p className="text-red-500">{error}</p>}
                {result && (
                    <div>
                         <h3 className="text-lg font-semibold mb-2 text-white">Result:</h3>
                        <CodeBlock code={result} />
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};
