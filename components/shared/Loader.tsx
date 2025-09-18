
import React from 'react';

export const Loader: React.FC<{ message?: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        {message && <p className="text-gray-400">{message}</p>}
    </div>
);
