
import React, { useState } from 'react';
import { ToolContainer } from './ToolContainer';
import { Tool } from '../../types';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { editImage } from '../../services/geminiService';

export const ImageEditorTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [result, setResult] = useState<{text: string | null, imageUrl: string | null} | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setOriginalImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!prompt.trim() || !imageFile || loading) return;
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const response = await editImage(prompt, imageFile);
            setResult(response);
        } catch (err) {
            setError('Failed to edit image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ToolContainer toolName={Tool.IMAGE_EDITOR}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                        disabled={loading}
                    />
                </div>
                {originalImageUrl && (
                    <div className="w-full max-w-sm mx-auto">
                        <p className="text-center text-sm mb-2">Original Image:</p>
                        <img src={originalImageUrl} alt="Original upload" className="rounded-md" />
                    </div>
                )}
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Add a futuristic city in the background."
                    className="w-full p-2 h-24 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading || !imageFile}
                />
                <Button onClick={handleSubmit} disabled={loading || !prompt.trim() || !imageFile}>
                    Edit Image
                </Button>

                {loading && <Loader />}
                {error && <p className="text-red-500">{error}</p>}
                {result && (
                     <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-white">Result:</h3>
                        {result.imageUrl && <img src={result.imageUrl} alt="Edited" className="rounded-md max-w-full h-auto mx-auto mb-4" style={{maxWidth: '512px'}}/>}
                        {result.text && <p className="text-gray-300">{result.text}</p>}
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};
