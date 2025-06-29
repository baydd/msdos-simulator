import React, { useState, useCallback } from 'react';
import { WindowState } from '../types';
import { Terminal } from './Terminal';
import { X, Minimize2, Maximize2, Square } from 'lucide-react';

interface WindowManagerProps {
  windows: WindowState[];
  onWindowUpdate: (windowId: string, updates: Partial<WindowState>) => void;
  onWindowClose: (windowId: string) => void;
  systemState: any;
  onSystemStateChange: (newState: any) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  onWindowUpdate,
  onWindowClose,
  systemState,
  onSystemStateChange
}) => {
  const [dragState, setDragState] = useState<{
    windowId: string;
    startX: number;
    startY: number;
    startWindowX: number;
    startWindowY: number;
  } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    // Bring window to front
    const maxZ = Math.max(...windows.map(w => w.zIndex));
    onWindowUpdate(windowId, { zIndex: maxZ + 1 });

    setDragState({
      windowId,
      startX: e.clientX,
      startY: e.clientY,
      startWindowX: window.position.x,
      startWindowY: window.position.y
    });
  }, [windows, onWindowUpdate]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;

    onWindowUpdate(dragState.windowId, {
      position: {
        x: Math.max(0, Math.min(window.innerWidth - 300, dragState.startWindowX + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - 200, dragState.startWindowY + deltaY))
      }
    });
  }, [dragState, onWindowUpdate]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  React.useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  const renderWindowContent = (window: WindowState) => {
    switch (window.type) {
      case 'terminal':
        return (
          <Terminal
            windowId={window.id}
            systemState={systemState}
            onSystemStateChange={onSystemStateChange}
          />
        );
      case 'browser':
        return (
          <div className="h-full bg-gray-200 p-4">
            <div className="bg-white h-full rounded border p-4">
              <h2 className="text-lg font-bold mb-4">Netscape Navigator 3.0</h2>
              <div className="border-2 border-gray-400 h-8 bg-white mb-4 flex items-center px-2">
                <span className="text-sm">Location: http://www.example.com</span>
              </div>
              <div className="text-sm">
                <h1 className="text-xl font-bold mb-4">Welcome to the World Wide Web!</h1>
                <p>This is a retro browser simulation. In the 90s, websites looked much simpler than today.</p>
                <hr className="my-4" />
                <p><strong>What's New:</strong></p>
                <ul className="list-disc ml-8">
                  <li>Animated GIFs everywhere!</li>
                  <li>Under construction pages</li>
                  <li>Visitor counters</li>
                  <li>Web rings</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="h-full bg-gray-800 text-white p-4">Unknown window type</div>;
    }
  };

  const visibleWindows = windows.filter(w => w.isVisible && !w.isMinimized);

  return (
    <>
      {visibleWindows.map(window => (
        <div
          key={window.id}
          className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden"
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height,
            zIndex: window.zIndex
          }}
        >
          {/* Title Bar */}
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 flex items-center justify-between cursor-move border-b border-gray-600"
            onMouseDown={(e) => handleMouseDown(e, window.id)}
          >
            <span className="font-bold text-sm">{window.title}</span>
            <div className="flex items-center space-x-1">
              <button
                className="w-6 h-6 bg-yellow-500 hover:bg-yellow-600 rounded-sm flex items-center justify-center"
                onClick={() => onWindowUpdate(window.id, { isMinimized: true })}
              >
                <Minimize2 className="w-3 h-3 text-black" />
              </button>
              <button
                className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-sm flex items-center justify-center"
              >
                <Square className="w-3 h-3 text-black" />
              </button>
              <button
                className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-sm flex items-center justify-center"
                onClick={() => onWindowClose(window.id)}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
          
          {/* Window Content */}
          <div className="h-full" style={{ height: 'calc(100% - 40px)' }}>
            {renderWindowContent(window)}
          </div>
        </div>
      ))}
    </>
  );
};