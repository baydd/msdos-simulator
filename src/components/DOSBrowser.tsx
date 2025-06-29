import React, { useState, useRef, useEffect } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface DOSBrowserProps {
  onExit: () => void;
}

export const DOSBrowser: React.FC<DOSBrowserProps> = ({ onExit }) => {
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://www.google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    dosSoundManager.playBeep(800, 100);
  }, []);

  const navigateToUrl = (url: string) => {
    let formattedUrl = url.trim();
    
    // Add protocol if missing
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    setIsLoading(true);
    setCurrentUrl(formattedUrl);
    setInputUrl(formattedUrl);
    
    // Add to history
    const newHistory = [...history.slice(0, historyIndex + 1), formattedUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToUrl(inputUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setCurrentUrl(url);
      setInputUrl(url);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const url = history[newIndex];
      setCurrentUrl(url);
      setInputUrl(url);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
    }, 500);
  };

  const goHome = () => {
    navigateToUrl('https://www.google.com');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onExit();
    }
  };

  return (
    <div className="h-full bg-gray-300 dos-font overflow-hidden" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Browser Title Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-2 py-1 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-bold">Netscape Navigator 3.0</div>
        </div>
        <button 
          onClick={onExit}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
        >
          ✕
        </button>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-200 border-b border-gray-400 px-2 py-1">
        <div className="flex space-x-4 text-sm">
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">File</span>
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">Edit</span>
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">View</span>
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">Go</span>
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">Bookmarks</span>
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">Options</span>
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">Directory</span>
          <span className="hover:bg-gray-300 px-2 py-1 cursor-pointer">Help</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-200 border-b border-gray-400 px-2 py-2">
        <div className="flex items-center space-x-2">
          {/* Navigation Buttons */}
          <button 
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 border border-gray-500 px-3 py-1 text-sm"
          >
            ← Back
          </button>
          <button 
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 border border-gray-500 px-3 py-1 text-sm"
          >
            Forward →
          </button>
          <button 
            onClick={refresh}
            className="bg-gray-300 hover:bg-gray-400 border border-gray-500 px-3 py-1 text-sm"
          >
            Reload
          </button>
          <button 
            onClick={goHome}
            className="bg-gray-300 hover:bg-gray-400 border border-gray-500 px-3 py-1 text-sm"
          >
            Home
          </button>
          
          <div className="w-px h-6 bg-gray-400 mx-2"></div>
          
          {/* URL Bar */}
          <div className="flex-1 flex items-center">
            <span className="text-sm mr-2">Location:</span>
            <form onSubmit={handleSubmit} className="flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full border-2 border-gray-400 px-2 py-1 text-sm font-mono"
                placeholder="Enter URL..."
              />
            </form>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-200 border-b border-gray-400 px-2 py-1">
        <div className="flex items-center space-x-4 text-xs">
          {isLoading ? (
            <span className="text-blue-600">🌐 Loading...</span>
          ) : (
            <span className="text-green-600">✓ Document: Done</span>
          )}
          <span>|</span>
          <span>Netscape: {currentUrl}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-2xl mb-4">🌐</div>
              <div className="text-lg mb-2">Loading...</div>
              <div className="text-sm text-gray-600">Connecting to {currentUrl}</div>
              <div className="mt-4">
                <div className="w-48 h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-blue-500 rounded animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={currentUrl}
          className="w-full h-full border-none"
          title="DOS Browser"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-gray-200 border-t border-gray-400 px-2 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>|</span>
          <span>Security: None</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>ESC: Exit to DOS</span>
        </div>
      </div>
    </div>
  );
};