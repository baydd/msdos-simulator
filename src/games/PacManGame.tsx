import React, { useState, useEffect, useCallback } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface PacManGameProps {
  onExit: () => void;
}

interface PacManGameState {
  score: number;
  lives: number;
  level: number;
  pacmanX: number;
  pacmanY: number;
  direction: 'up' | 'down' | 'left' | 'right';
  ghosts: Array<{ x: number; y: number; color: string; direction: string }>;
  dots: boolean[][];
  powerPellets: Array<{ x: number; y: number }>;
  gameRunning: boolean;
  powerMode: boolean;
  map: string[][];
}

export const PacManGame: React.FC<PacManGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<PacManGameState>({
    score: 0,
    lives: 3,
    level: 1,
    pacmanX: 9,
    pacmanY: 15,
    direction: 'right',
    ghosts: [
      { x: 9, y: 9, color: 'red', direction: 'up' },
      { x: 10, y: 9, color: 'pink', direction: 'down' },
      { x: 8, y: 9, color: 'cyan', direction: 'left' },
      { x: 11, y: 9, color: 'orange', direction: 'right' }
    ],
    dots: [],
    powerPellets: [
      { x: 1, y: 3 }, { x: 17, y: 3 },
      { x: 1, y: 15 }, { x: 17, y: 15 }
    ],
    gameRunning: true,
    powerMode: false,
    map: [
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', 'o', '#', '#', '.', '#', '#', '#', '.', '#', '.', '#', '#', '#', '.', '#', '#', 'o', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '#', '#', '.', '#', '.', '#', '#', '#', '#', '#', '.', '#', '.', '#', '#', '.', '#'],
      ['#', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '.', '#', '#', '#', ' ', '#', ' ', '#', '#', '#', '.', '#', '#', '#', '#'],
      [' ', ' ', ' ', '#', '.', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', '.', '#', ' ', ' ', ' '],
      ['#', '#', '#', '#', '.', '#', ' ', '#', '#', ' ', '#', '#', ' ', '#', '.', '#', '#', '#', '#'],
      [' ', ' ', ' ', ' ', '.', ' ', ' ', '#', ' ', ' ', ' ', '#', ' ', ' ', '.', ' ', ' ', ' ', ' '],
      ['#', '#', '#', '#', '.', '#', ' ', '#', '#', '#', '#', '#', ' ', '#', '.', '#', '#', '#', '#'],
      [' ', ' ', ' ', '#', '.', '#', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '#', '.', '#', ' ', ' ', ' '],
      ['#', '#', '#', '#', '.', '#', '#', '#', ' ', '#', ' ', '#', '#', '#', '.', '#', '#', '#', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '#', '#', '.', '#', '#', '#', '.', '#', '.', '#', '#', '#', '.', '#', '#', '.', '#'],
      ['#', 'o', '.', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#', '.', 'o', '#'],
      ['#', '#', '.', '#', '.', '#', '.', '#', '#', '#', '#', '#', '.', '#', '.', '#', '.', '#', '#'],
      ['#', '.', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '#', '.', '.', '.', '.', '#'],
      ['#', '.', '#', '#', '#', '#', '#', '#', '.', '#', '.', '#', '#', '#', '#', '#', '#', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ]
  });

  useEffect(() => {
    // Initialize dots
    const dots: boolean[][] = [];
    for (let y = 0; y < gameState.map.length; y++) {
      dots[y] = [];
      for (let x = 0; x < gameState.map[y].length; x++) {
        dots[y][x] = gameState.map[y][x] === '.';
      }
    }
    setGameState(prev => ({ ...prev, dots }));
  }, []);

  const movePacman = useCallback((newDirection: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => {
      let newX = prev.pacmanX;
      let newY = prev.pacmanY;
      
      switch (newDirection) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }
      
      // Wrap around screen
      if (newX < 0) newX = prev.map[0].length - 1;
      if (newX >= prev.map[0].length) newX = 0;
      
      // Check walls
      if (prev.map[newY] && prev.map[newY][newX] === '#') {
        return prev;
      }
      
      let newScore = prev.score;
      const newDots = [...prev.dots];
      
      // Eat dot
      if (newDots[newY] && newDots[newY][newX]) {
        newDots[newY][newX] = false;
        newScore += 10;
        dosSoundManager.playBeep(800, 50);
      }
      
      // Check power pellet
      const powerPelletIndex = prev.powerPellets.findIndex(p => p.x === newX && p.y === newY);
      if (powerPelletIndex !== -1) {
        newScore += 50;
        dosSoundManager.playBeep(400, 200);
        const newPowerPellets = [...prev.powerPellets];
        newPowerPellets.splice(powerPelletIndex, 1);
        return { 
          ...prev, 
          pacmanX: newX, 
          pacmanY: newY, 
          direction: newDirection, 
          score: newScore,
          dots: newDots,
          powerPellets: newPowerPellets,
          powerMode: true
        };
      }
      
      return { 
        ...prev, 
        pacmanX: newX, 
        pacmanY: newY, 
        direction: newDirection, 
        score: newScore,
        dots: newDots
      };
    });
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameState.gameRunning) return;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        movePacman('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        movePacman('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        movePacman('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        movePacman('right');
        break;
      case 'Escape':
        e.preventDefault();
        onExit();
        break;
    }
  }, [gameState.gameRunning, movePacman, onExit]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Ghost movement
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newGhosts = prev.ghosts.map(ghost => {
          const directions = ['up', 'down', 'left', 'right'];
          const newDirection = directions[Math.floor(Math.random() * directions.length)];
          
          let newX = ghost.x;
          let newY = ghost.y;
          
          switch (newDirection) {
            case 'up': newY--; break;
            case 'down': newY++; break;
            case 'left': newX--; break;
            case 'right': newX++; break;
          }
          
          // Check boundaries and walls
          if (newX < 0 || newX >= prev.map[0].length || 
              newY < 0 || newY >= prev.map.length ||
              prev.map[newY][newX] === '#') {
            return ghost;
          }
          
          return { ...ghost, x: newX, y: newY, direction: newDirection };
        });
        
        return { ...prev, ghosts: newGhosts };
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const renderMap = () => {
    return gameState.map.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => {
          let char = ' ';
          let color = 'text-blue-400';
          
          // Pacman
          if (x === gameState.pacmanX && y === gameState.pacmanY) {
            switch (gameState.direction) {
              case 'right': char = 'C'; break;
              case 'left': char = 'Ɔ'; break;
              case 'up': char = 'U'; break;
              case 'down': char = '∩'; break;
            }
            color = 'text-yellow-400';
          }
          // Ghosts
          else {
            const ghost = gameState.ghosts.find(g => g.x === x && g.y === y);
            if (ghost) {
              char = gameState.powerMode ? 'Ω' : 'M';
              color = gameState.powerMode ? 'text-blue-400' : 
                     ghost.color === 'red' ? 'text-red-400' :
                     ghost.color === 'pink' ? 'text-pink-400' :
                     ghost.color === 'cyan' ? 'text-cyan-400' : 'text-orange-400';
            }
            // Map elements
            else if (cell === '#') {
              char = '█';
              color = 'text-blue-400';
            } else if (gameState.dots[y] && gameState.dots[y][x]) {
              char = '·';
              color = 'text-yellow-200';
            } else if (gameState.powerPellets.find(p => p.x === x && p.y === y)) {
              char = '●';
              color = 'text-yellow-400';
            } else if (cell === ' ') {
              char = ' ';
            }
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

  return (
    <div className="h-full bg-black text-white dos-font p-2 overflow-hidden">
      <div className="text-center mb-2 text-yellow-400">
        === PAC-MAN === Score: {gameState.score} | Lives: {'♥'.repeat(gameState.lives)} | Level: {gameState.level}
      </div>
      
      <div className="border border-yellow-400 p-2">
        <div className="font-mono text-sm leading-none">
          {renderMap()}
        </div>
      </div>
      
      <div className="text-center mt-2 text-xs text-gray-400">
        Arrow Keys: Move | ESC: Exit | Eat all dots to win!
      </div>
    </div>
  );
};