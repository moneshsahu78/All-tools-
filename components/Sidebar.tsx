
import React from 'react';
import { TOOLS } from '../constants';
import { Tool } from '../types';

interface SidebarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTool, setSelectedTool }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm w-64 p-4 space-y-2 border-r border-gray-700 flex flex-col">
       <h2 className="text-xl font-bold text-white mb-4 px-2">Gemini Tools</h2>
      {TOOLS.map((tool) => (
        <button
          key={tool.name}
          onClick={() => setSelectedTool(tool.name)}
          className={`flex items-center w-full p-2 rounded-md text-left transition-colors duration-200 ${
            selectedTool === tool.name
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="mr-3">{tool.icon}</span>
          <span>{tool.name}</span>
        </button>
      ))}
    </div>
  );
};
