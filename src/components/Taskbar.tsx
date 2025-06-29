import React from 'react';
import { WindowState } from '../types';
import { Terminal, Globe, Settings, FolderOpen } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  onWindowToggle: (windowId: string) => void;
  onCreateWindow: (type: 'terminal' | 'browser' | 'filemanager' | 'settings') => void;
  currentTime: string;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  onWindowToggle,
  onCreateWindow,
  currentTime
}) => {
  const getWindowIcon = (type: string) => {
    switch (type) {
      case 'terminal':
        return <Terminal className="w-4 h-4" />;
      case 'browser':
        return <Globe className="w-4 h-4" />;
      case 'filemanager':
        return <FolderOpen className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 border-t-2 border-gray-400 flex items-center px-2 z-50">
      
      {/* Start Menu Button */}
      <button 
        className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white px-4 py-2 rounded font-bold text-sm mr-2 border border-green-400"
        onClick={() => onCreateWindow('terminal')}
      >
        Start
      </button>
      
      {/* Quick Launch Icons */}
      <div className="flex items-center space-x-1 mr-4">
        <button
          className="p-2 hover:bg-gray-600 rounded"
          title="Terminal"
          onClick={() => onCreateWindow('terminal')}
        >
          <Terminal className="w-5 h-5 text-green-400" />
        </button>
        <button
          className="p-2 hover:bg-gray-600 rounded"
          title="Browser"
          onClick={() => onCreateWindow('browser')}
        >
          <Globe className="w-5 h-5 text-blue-400" />
        </button>
        <button
          className="p-2 hover:bg-gray-600 rounded"
          title="File Manager"
          onClick={() => onCreateWindow('filemanager')}
        >
          <FolderOpen className="w-5 h-5 text-yellow-400" />
        </button>
      </div>
      
      {/* Separator */}
      <div className="w-px h-8 bg-gray-500 mr-4" />
      
      {/* Window List */}
      <div className="flex-1 flex items-center space-x-1">
        {windows.filter(w => w.isVisible).map(window => (
          <button
            key={window.id}
            className={`
              flex items-center space-x-2 px-3 py-1 rounded text-sm
              ${window.isMinimized 
                ? 'bg-gray-600 hover:bg-gray-500' 
                : 'bg-blue-600 hover:bg-blue-500'
              }
              text-white border border-gray-400
            `}
            onClick={() => onWindowToggle(window.id)}
          >
            {getWindowIcon(window.type)}
            <span className="max-w-32 truncate">{window.title}</span>
          </button>
        ))}
      </div>
      
      {/* System Tray */}
      <div className="flex items-center space-x-2 ml-4">
        <div className="text-white text-sm font-mono bg-gray-800 px-2 py-1 rounded border border-gray-600">
          {currentTime}
        </div>
      </div>
    </div>
  );
};