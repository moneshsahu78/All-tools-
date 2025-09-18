
import React from 'react';
import { TOOLS } from '../../constants';
import { Tool } from '../../types';

interface ToolContainerProps {
  toolName: Tool;
  children: React.ReactNode;
}

export const ToolContainer: React.FC<ToolContainerProps> = ({ toolName, children }) => {
  const tool = TOOLS.find(t => t.name === toolName);

  return (
    <div className="p-6 sm:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">{tool?.name}</h1>
        <p className="text-gray-400">{tool?.description}</p>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        {children}
      </div>
    </div>
  );
};
