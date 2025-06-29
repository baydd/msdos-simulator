import React, { useState, useEffect, useCallback } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface PrinceGameProps {
  onExit: () => void;
}

interface PrinceGameState {
  level: number;
  lives: number;
  health: number;
  time: number;
  playerX: number;
  playerY: number;
  playerDirection: 'left' | 'right';
  isJumping: boolean;
  isFalling: boolean;
  gameRunning: boolean;
  currentRoom: number;
  hasKey: boolean;
  map: string[][];
}

export const PrinceOfPersiaGame: React.FC<PrinceGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<PrinceGameState>({
    level: 1,
    lives: 3,
    health: 3,
    time: 3600, // 60 minutes in seconds
    playerX: 2,
    playerY: 9,
    playerDirection: 'right',
    isJumping: false,
    isFalling: false,
    gameRunning: true,
    currentRoom: 1,
    hasKey: false,
    map: [
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '#', '#', '.', '.', '.', '.', '#', '#', '#', '#', '#', '.', '.', '.', '.', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ]
  });

  const [messages, setMessages] = useState<string[]>([
    '██████╗ ██████╗ ██╗███╗   ██╗ ██████╗███████╗',
    '██╔══██╗██╔══██╗██║████╗  ██║██╔════╝██╔════╝',
    '██████╔╝██████╔╝██║██╔██╗ ██║██║     █████╗  ',
    '██╔═══╝ ██╔══██╗██║██║╚██╗██║██║     ██╔══╝  ',
    '██║     ██║  ██║██║██║ ╚████║╚██████╗███████╗',
    '╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝',
    '                                              ',
    '         ██████╗ ███████╗                     ',
    '        ██╔═══██╗██╔════╝                     ',
    '        ██║   ██║█████╗                       ',
    '        ██║   ██║██╔══╝                       ',
    '        ╚██████╔╝██║                          ',
    '         ╚═════╝ ╚═╝                          ',
    '                                              ',
    '██████╗ ███████╗██████╗ ███████╗██╗ █████╗   ',
    '██╔══██╗██╔════╝██╔══██╗██╔════╝██║██╔══██╗  ',
    '██████╔╝█████╗  ██████╔╝███████╗██║███████║  ',
    '██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║██╔══██║  ',
    '██║     ███████╗██║  ██║███████║██║██║  ██║  ',
    '╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝  ',
    '',
    'Prince of Persia v1.0',
    'Copyright (C) 1989 Broderbund Software',
    '',
    'Loading game data...',
    'Initializing graphics...',
    'Starting Level 1...',
    '',
    'Arrow Keys: Move/Jump | Shift: Run | Ctrl: Sword | ESC: Exit',
    'Save the Princess! You have 60 minutes!',
    ''
  ]);

  useEffect(() => {
    dosSoundManager.playBeep(440, 200);
    
    // Game timer
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.time <= 0) {
          setMessages(prevMessages => [...prevMessages, 'TIME UP! Game Over!']);
          return { ...prev, gameRunning: false };
        }
        return { ...prev, time: prev.time - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      const newX = Math.max(1, Math.min(18, prev.playerX + dx));
      const newY = prev.playerY;
      
      // Check for collisions
      if (prev.map[newY] && prev.map[newY][newX] === '#') {
        return prev;
      }
      
      return { 
        ...prev, 
        playerX: newX,
        playerDirection: dx > 0 ? 'right' : dx < 0 ? 'left' : prev.playerDirection
      };
    });
  }, []);

  const jump = useCallback(() => {
    if (!gameState.isJumping && !gameState.isFalling) {
      dosSoundManager.playBeep(600, 150);
      setGameState(prev => ({ ...prev, isJumping: true }));
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isJumping: false }));
      }, 500);
    }
  }, [gameState.isJumping, gameState.isFalling]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameState.gameRunning) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        movePlayer(-1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        movePlayer(1, 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        jump();
        break;
      case 'Shift':
        e.preventDefault();
        // Running mode
        break;
      case 'Control':
        e.preventDefault();
        dosSoundManager.playBeep(300, 100);
        setMessages(prev => [...prev, 'Sword attack!']);
        break;
      case 'Escape':
        e.preventDefault();
        onExit();
        break;
    }
  }, [gameState.gameRunning, movePlayer, jump, onExit]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const renderMap = () => {
    return gameState.map.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => {
          let char = cell;
          let color = 'text-gray-400';
          
          if (x === gameState.playerX && y === gameState.playerY) {
            char = gameState.playerDirection === 'right' ? '►' : '◄';
            color = gameState.isJumping ? 'text-yellow-400' : 'text-white';
          } else if (cell === '#') {
            char = '█';
            color = 'text-blue-400';
          } else if (cell === '.') {
            char = ' ';
          }
          
          return (
            <span key={x} className={`${color} w-4`}>
              {char}
            </span>
          );
        })}
      </div>
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-black text-white dos-font p-2 overflow-hidden">
      <div className="grid grid-cols-4 h-full gap-4">
        {/* Game Area */}
        <div className="col-span-3">
          <div className="border border-gray-600 p-2 h-full">
            <div className="text-center mb-2 text-yellow-400">
              === PRINCE OF PERSIA - LEVEL {gameState.level} ===
            </div>
            <div className="font-mono text-sm leading-none">
              {renderMap()}
            </div>
          </div>
        </div>
        
        {/* Game Info */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="border border-gray-600 p-2">
            <div className="text-green-400">STATUS</div>
            <div>Level: {gameState.level}</div>
            <div>Lives: {'♥'.repeat(gameState.lives)}</div>
            <div>Health: {'█'.repeat(gameState.health)}</div>
            <div>Time: {formatTime(gameState.time)}</div>
            <div>Room: {gameState.currentRoom}</div>
          </div>
          
          {/* Messages */}
          <div className="border border-gray-600 p-2 flex-1 overflow-y-auto">
            <div className="text-yellow-400 mb-2">LOG</div>
            {messages.slice(-10).map((msg, i) => (
              <div key={i} className="text-xs mb-1">{msg}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        ← → Move | ↑ Jump | Shift: Run | Ctrl: Sword | ESC: Exit
      </div>
    </div>
  );
};