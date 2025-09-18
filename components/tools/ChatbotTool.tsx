
import React, { useState, useEffect, useRef } from 'react';
import { ToolContainer } from './ToolContainer';
import { Tool, ChatMessage } from '../../types';
import { Button } from '../shared/Button';
import { Loader } from '../shared/Loader';
import { streamChat, startChat } from '../../services/geminiService';

export const ChatbotTool: React.FC = () => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startChat();
        setHistory([]);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;

        const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: prompt }] };
        setHistory(prev => [...prev, newUserMessage]);
        setPrompt('');
        setLoading(true);

        try {
            const stream = streamChat(prompt);
            let modelResponse = '';
            setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
                    return newHistory;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setHistory(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I encountered an error.' }] }]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <ToolContainer toolName={Tool.CHATBOT}>
            <div className="flex flex-col h-full">
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 bg-gray-800 rounded-lg overflow-y-auto mb-4">
                    {history.length === 0 && <div className="text-center text-gray-400">Start the conversation!</div>}
                    {history.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && history[history.length -1]?.role === 'user' && (
                         <div className="flex justify-start">
                             <div className="max-w-xl px-4 py-2 rounded-lg bg-gray-700 text-gray-200">
                                <Loader/>
                            </div>
                         </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading || !prompt.trim()}>
                        Send
                    </Button>
                </form>
            </div>
        </ToolContainer>
    );
};
