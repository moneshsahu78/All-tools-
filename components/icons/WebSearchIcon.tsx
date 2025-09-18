
import React from 'react';

export const WebSearchIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 14a6 6 0 00-3.446 1.052l-2.094 2.094a6 6 0 008.486 0l-2.094-2.094A6 6 0 0010 14z" />
    </svg>
);
