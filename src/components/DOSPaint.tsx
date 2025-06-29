import React, { useState, useRef, useEffect } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface DOSPaintProps {
  onExit: () => void;
}

export const DOSPaint: React.FC<DOSPaintProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'fill' | 'line' | 'rect' | 'circle'>('pen');
  const [currentColor, setCurrentColor] = useState('#00FF00');
  const [brushSize, setBrushSize] = useState(2);
  const [showGrid, setShowGrid] = useState(false);

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000',
    '#800080', '#008080', '#C0C0C0', '#808080'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
      drawGrid(ctx);
    }
  }, [showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < 640; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 480);
      ctx.stroke();
    }
    
    for (let y = 0; y < 480; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(640, y);
      ctx.stroke();
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing && currentTool !== 'fill') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dosSoundManager.playBeep(1000, 10);

    switch (currentTool) {
      case 'pen':
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
        ctx.fill();
        break;
      
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize * 2, 0, 2 * Math.PI);
        ctx.fill();
        break;
      
      case 'fill':
        floodFill(ctx, x, y, currentColor);
        break;
    }
  };

  const floodFill = (ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string) => {
    // Simple flood fill implementation
    ctx.fillStyle = fillColor;
    ctx.fillRect(Math.floor(x / 20) * 20, Math.floor(y / 20) * 20, 20, 20);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
      drawGrid(ctx);
    }
    
    dosSoundManager.playBeep(400, 200);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'dos-paint-masterpiece.png';
    link.href = canvas.toDataURL();
    link.click();
    
    dosSoundManager.playBeep(800, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onExit();
    }
  };

  return (
    <div className="h-full bg-gray-300 dos-font overflow-hidden flex" onKeyDown={handleKeyPress} tabIndex={0}>
      {/* Toolbar */}
      <div className="w-48 bg-gray-200 border-r-2 border-gray-400 p-2">
        <div className="text-center font-bold mb-4 text-black">
          DOS PAINT v1.0
        </div>
        
        {/* Tools */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2 text-black">Tools:</div>
          <div className="grid grid-cols-2 gap-1">
            {[
              { tool: 'pen', icon: '✏️', name: 'Pen' },
              { tool: 'eraser', icon: '🧽', name: 'Eraser' },
              { tool: 'fill', icon: '🪣', name: 'Fill' },
              { tool: 'line', icon: '📏', name: 'Line' }
            ].map(({ tool, icon, name }) => (
              <button
                key={tool}
                onClick={() => setCurrentTool(tool as any)}
                className={`p-2 text-xs border ${
                  currentTool === tool 
                    ? 'bg-blue-500 text-white border-blue-600' 
                    : 'bg-gray-300 text-black border-gray-400'
                } hover:bg-blue-400`}
              >
                {icon} {name}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2 text-black">Colors:</div>
          <div className="grid grid-cols-4 gap-1">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-8 h-8 border-2 ${
                  currentColor === color ? 'border-white' : 'border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div className="mb-4">
          <div className="text-sm font-bold mb-2 text-black">Brush Size:</div>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-center text-black">{brushSize}px</div>
        </div>

        {/* Options */}
        <div className="mb-4">
          <label className="flex items-center text-sm text-black">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="mr-2"
            />
            Show Grid
          </label>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={clearCanvas}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-2 text-sm border border-red-600"
          >
            Clear
          </button>
          <button
            onClick={saveImage}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 text-sm border border-green-600"
          >
            Save
          </button>
          <button
            onClick={onExit}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white p-2 text-sm border border-gray-600"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-black p-4">
        <div className="bg-white border-2 border-gray-400 inline-block">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair"
          />
        </div>
        
        <div className="text-green-400 text-xs mt-2">
          Resolution: 640x480 | Tool: {currentTool.toUpperCase()} | Color: {currentColor} | ESC: Exit
        </div>
      </div>
    </div>
  );
};