
import React, { useState } from 'react';
import { Tool } from './types';
import { Sidebar } from './components/Sidebar';
import { ChatbotTool } from './components/tools/ChatbotTool';
import { TextGenerationTool } from './components/tools/TextGenerationTool';
import { JsonGeneratorTool } from './components/tools/JsonGeneratorTool';
import { WebSearchTool } from './components/tools/WebSearchTool';
import { ImageGenerationTool } from './components/tools/ImageGenerationTool';
import { ImageEditorTool } from './components/tools/ImageEditorTool';
import { VideoGenerationTool } from './components/tools/VideoGenerationTool';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.CHATBOT);

  const renderTool = () => {
    switch (selectedTool) {
      case Tool.CHATBOT:
        return <ChatbotTool />;
      case Tool.TEXT_GENERATION:
        return <TextGenerationTool />;
      case Tool.JSON_GENERATOR:
        return <JsonGeneratorTool />;
      case Tool.WEB_SEARCH:
        return <WebSearchTool />;
      case Tool.IMAGE_GENERATION:
        return <ImageGenerationTool />;
      case Tool.IMAGE_EDITOR:
        return <ImageEditorTool />;
      case Tool.VIDEO_GENERATION:
          return <VideoGenerationTool />;
      default:
        return <ChatbotTool />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <Sidebar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <main className="flex-1 overflow-hidden">
        {renderTool()}
      </main>
    </div>
  );
};

export default App;
