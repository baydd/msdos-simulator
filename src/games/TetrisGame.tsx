import React, { useState, useEffect, useCallback } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface TetrisGameProps {
  onExit: () => void;
}

interface TetrisGameState {
  board: number[][];
  currentPiece: {
    shape: number[][];
    x: number;
    y: number;
    type: number;
  } | null;
  nextPiece: number[][];
  score: number;
  lines: number;
  level: number;
  gameRunning: boolean;
  dropTime: number;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETRIS_PIECES = [
  // I piece
  [
    [1, 1, 1, 1]
  ],
  // O piece
  [
    [2, 2],
    [2, 2]
  ],
  // T piece
  [
    [0, 3, 0],
    [3, 3, 3]
  ],
  // S piece
  [
    [0, 4, 4],
    [4, 4, 0]
  ],
  // Z piece
  [
    [5, 5, 0],
    [0, 5, 5]
  ],
  // J piece
  [
    [6, 0, 0],
    [6, 6, 6]
  ],
  // L piece
  [
    [0, 0, 7],
    [7, 7, 7]
  ]
];

export const TetrisGame: React.FC<TetrisGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<TetrisGameState>({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null,
    nextPiece: TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)],
    score: 0,
    lines: 0,
    level: 1,
    gameRunning: true,
    dropTime: 1000
  });

  const createNewPiece = useCallback(() => {
    const piece = gameState.nextPiece;
    const nextPiece = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
    
    return {
      currentPiece: {
        shape: piece,
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece[0].length / 2),
        y: 0,
        type: piece[0][0]
      },
      nextPiece
    };
  }, [gameState.nextPiece]);

  const rotatePiece = (piece: number[][]) => {
    const rotated = piece[0].map((_, index) =>
      piece.map(row => row[index]).reverse()
    );
    return rotated;
  };

  const isValidMove = (board: number[][], piece: any, x: number, y: number) => {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px] !== 0) {
          const newX = x + px;
          const newY = y + py;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = (board: number[][], piece: any) => {
    const newBoard = board.map(row => [...row]);
    
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px] !== 0) {
          const x = piece.x + px;
          const y = piece.y + py;
          if (y >= 0) {
            newBoard[y][x] = piece.type;
          }
        }
      }
    }
    
    return newBoard;
  };

  const clearLines = (board: number[][]) => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { board: newBoard, linesCleared };
  };

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || !prev.gameRunning) {
        const newPieceData = createNewPiece();
        return {
          ...prev,
          ...newPieceData
        };
      }
      
      const newY = prev.currentPiece.y + 1;
      
      if (isValidMove(prev.board, prev.currentPiece, prev.currentPiece.x, newY)) {
        return {
          ...prev,
          currentPiece: { ...prev.currentPiece, y: newY }
        };
      } else {
        // Place piece
        const newBoard = placePiece(prev.board, prev.currentPiece);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);
        
        dosSoundManager.playBeep(400, 100);
        
        if (linesCleared > 0) {
          dosSoundManager.playBeep(800, 200);
        }
        
        const newScore = prev.score + (linesCleared * 100 * prev.level);
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        const newPieceData = createNewPiece();
        
        // Check game over
        if (!isValidMove(clearedBoard, newPieceData.currentPiece, newPieceData.currentPiece.x, newPieceData.currentPiece.y)) {
          return { ...prev, gameRunning: false };
        }
        
        return {
          ...prev,
          board: clearedBoard,
          score: newScore,
          lines: newLines,
          level: newLevel,
          dropTime: Math.max(100, 1000 - (newLevel * 50)),
          ...newPieceData
        };
      }
    });
  }, [createNewPiece]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameState.gameRunning || !gameState.currentPiece) return;
    
    setGameState(prev => {
      if (!prev.currentPiece) return prev;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(prev.board, prev.currentPiece, prev.currentPiece.x - 1, prev.currentPiece.y)) {
            return {
              ...prev,
              currentPiece: { ...prev.currentPiece, x: prev.currentPiece.x - 1 }
            };
          }
          break;
        case 'ArrowRight':
          if (isValidMove(prev.board, prev.currentPiece, prev.currentPiece.x + 1, prev.currentPiece.y)) {
            return {
              ...prev,
              currentPiece: { ...prev.currentPiece, x: prev.currentPiece.x + 1 }
            };
          }
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
        case ' ':
          const rotated = rotatePiece(prev.currentPiece.shape);
          if (isValidMove(prev.board, { ...prev.currentPiece, shape: rotated }, prev.currentPiece.x, prev.currentPiece.y)) {
            return {
              ...prev,
              currentPiece: { ...prev.currentPiece, shape: rotated }
            };
          }
          break;
        case 'Escape':
          onExit();
          break;
      }
      
      return prev;
    });
  }, [gameState.gameRunning, gameState.currentPiece, dropPiece, onExit]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const interval = setInterval(dropPiece, gameState.dropTime);
    return () => clearInterval(interval);
  }, [dropPiece, gameState.dropTime]);

  const renderBoard = () => {
    const displayBoard = gameState.board.map(row => [...row]);
    
    // Add current piece to display
    if (gameState.currentPiece) {
      for (let py = 0; py < gameState.currentPiece.shape.length; py++) {
        for (let px = 0; px < gameState.currentPiece.shape[py].length; px++) {
          if (gameState.currentPiece.shape[py][px] !== 0) {
            const x = gameState.currentPiece.x + px;
            const y = gameState.currentPiece.y + py;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = gameState.currentPiece.type;
            }
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => {
          const colors = [
            'text-black',      // 0 - empty
            'text-cyan-400',   // 1 - I piece
            'text-yellow-400', // 2 - O piece
            'text-purple-400', // 3 - T piece
            'text-green-400',  // 4 - S piece
            'text-red-400',    // 5 - Z piece
            'text-blue-400',   // 6 - J piece
            'text-orange-400'  // 7 - L piece
          ];
          
          return (
            <span key={x} className={`${colors[cell]} w-4`}>
              {cell === 0 ? '·' : '█'}
            </span>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="h-full bg-black text-white dos-font p-2 overflow-hidden">
      <div className="grid grid-cols-3 h-full gap-4">
        {/* Game Board */}
        <div className="col-span-2">
          <div className="text-center mb-2 text-cyan-400">
            ████████╗███████╗████████╗██████╗ ██╗███████╗
          </div>
          <div className="text-center mb-2 text-cyan-400">
            ╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██║██╔════╝
          </div>
          <div className="text-center mb-2 text-cyan-400">
               ██║   █████╗     ██║   ██████╔╝██║███████╗
          </div>
          <div className="text-center mb-2 text-cyan-400">
               ██║   ██╔══╝     ██║   ██╔══██╗██║╚════██║
          </div>
          <div className="text-center mb-4 text-cyan-400">
               ██║   ███████╗   ██║   ██║  ██║██║███████║
          </div>
          
          <div className="border border-cyan-400 p-2">
            <div className="font-mono text-sm leading-none">
              {renderBoard()}
            </div>
          </div>
        </div>
        
        {/* Game Info */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="border border-cyan-400 p-2">
            <div className="text-yellow-400">STATS</div>
            <div>Score: {gameState.score}</div>
            <div>Lines: {gameState.lines}</div>
            <div>Level: {gameState.level}</div>
          </div>
          
          {/* Next Piece */}
          <div className="border border-cyan-400 p-2">
            <div className="text-yellow-400 mb-2">NEXT</div>
            <div className="font-mono text-sm">
              {gameState.nextPiece.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <span key={x} className={`w-4 ${cell !== 0 ? 'text-white' : 'text-black'}`}>
                      {cell !== 0 ? '█' : '·'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {!gameState.gameRunning && (
            <div className="border border-red-400 p-2">
              <div className="text-red-400 text-center">GAME OVER!</div>
              <div className="text-center mt-2">Final Score: {gameState.score}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        ← → Move | ↓ Drop | ↑/Space: Rotate | ESC: Exit
      </div>
    </div>
  );
};