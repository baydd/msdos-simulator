import React, { useState, useEffect, useCallback } from 'react';
import { DoomGameState } from '../types';
import { dosSoundManager } from '../utils/dosSounds';

interface DoomGameProps {
  onExit: () => void;
}

export const DoomGame: React.FC<DoomGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<DoomGameState>({
    level: 1,
    health: 100,
    ammo: 50,
    score: 0,
    playerX: 5,
    playerY: 5,
    enemies: [
      { x: 10, y: 8, health: 30, type: 'imp' },
      { x: 15, y: 12, health: 50, type: 'demon' },
      { x: 8, y: 15, health: 20, type: 'zombie' }
    ],
    map: [
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '#', '#', '.', '.', '.', '#', '#', '#', '.', '.', '.', '#', '#', '.', '.', '.', '.', '#'],
      ['#', '.', '#', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '.', '.', '#'],
      ['#', '.', '#', '.', '.', '.', '.', '.', '.', '#', '.', '.', '.', '.', '#', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '@', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'E', '.', '#'],
      ['#', '.', '#', '#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'E', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'E', '.', '.', '.', '#'],
      ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    gameRunning: true
  });

  const [messages, setMessages] = useState<string[]>([
    '████████╗ ██████╗  ██████╗ ███╗   ███╗',
    '██╔═══██║██╔═══██╗██╔═══██╗████╗ ████║',
    '██║   ██║██║   ██║██║   ██║██╔████╔██║',
    '██║   ██║██║   ██║██║   ██║██║╚██╔╝██║',
    '╚██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║',
    ' ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝',
    '',
    'DOOM v1.0 Shareware',
    'Copyright (C) 1993 id Software',
    '',
    'Loading WAD file: DOOM1.WAD',
    'Initializing sound system...',
    'Starting game...',
    '',
    'Use Arrow Keys to move, CTRL to shoot, ESC to exit',
    'Find the exit (E) while avoiding demons!',
    ''
  ]);

  useEffect(() => {
    dosSoundManager.playDoomMusic();
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      const newX = prev.playerX + dx;
      const newY = prev.playerY + dy;
      
      // Check boundaries and walls
      if (newX < 0 || newX >= prev.map[0].length || 
          newY < 0 || newY >= prev.map.length ||
          prev.map[newY][newX] === '#') {
        return prev;
      }
      
      // Check if player reached exit
      if (prev.map[newY][newX] === 'E') {
        setMessages(prevMessages => [
          ...prevMessages,
          'Level Complete! You found the exit!',
          'Score: ' + (prev.score + 1000),
          'Press ESC to exit to DOS'
        ]);
        return { ...prev, score: prev.score + 1000, gameRunning: false };
      }
      
      return { ...prev, playerX: newX, playerY: newY };
    });
  }, []);

  const shootWeapon = useCallback(() => {
    if (gameState.ammo <= 0) {
      setMessages(prev => [...prev, 'Out of ammo!']);
      return;
    }
    
    dosSoundManager.playBeep(400, 100);
    
    setGameState(prev => {
      const newAmmo = prev.ammo - 1;
      let newEnemies = [...prev.enemies];
      let newScore = prev.score;
      
      // Simple shooting logic - hit enemy in front of player
      const targetX = prev.playerX + 1;
      const targetY = prev.playerY;
      
      const enemyIndex = newEnemies.findIndex(e => 
        Math.abs(e.x - targetX) <= 1 && Math.abs(e.y - targetY) <= 1
      );
      
      if (enemyIndex !== -1) {
        newEnemies[enemyIndex].health -= 25;
        if (newEnemies[enemyIndex].health <= 0) {
          newEnemies.splice(enemyIndex, 1);
          newScore += 100;
          setMessages(prevMessages => [...prevMessages, `Killed ${newEnemies[enemyIndex]?.type || 'demon'}! +100 points`]);
        }
      }
      
      return { ...prev, ammo: newAmmo, enemies: newEnemies, score: newScore };
    });
  }, [gameState.ammo]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameState.gameRunning) return;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        movePlayer(0, -1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        movePlayer(0, 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        movePlayer(-1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        movePlayer(1, 0);
        break;
      case 'Control':
        e.preventDefault();
        shootWeapon();
        break;
      case 'Escape':
        e.preventDefault();
        onExit();
        break;
    }
  }, [gameState.gameRunning, movePlayer, shootWeapon, onExit]);

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
            char = '@';
            color = 'text-green-400';
          } else {
            const enemy = gameState.enemies.find(e => e.x === x && e.y === y);
            if (enemy) {
              char = enemy.type === 'imp' ? 'i' : enemy.type === 'demon' ? 'D' : 'Z';
              color = 'text-red-400';
            } else if (cell === '#') {
              color = 'text-blue-400';
            } else if (cell === 'E') {
              color = 'text-yellow-400';
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
      <div className="grid grid-cols-3 h-full gap-4">
        {/* Game Map */}
        <div className="col-span-2">
          <div className="border border-gray-600 p-2 h-full">
            <div className="text-center mb-2 text-yellow-400">
              === DOOM LEVEL {gameState.level} ===
            </div>
            <div className="font-mono text-sm leading-none">
              {renderMap()}
            </div>
          </div>
        </div>
        
        {/* Game Info & Messages */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="border border-gray-600 p-2">
            <div className="text-green-400">STATS</div>
            <div>Health: {gameState.health}%</div>
            <div>Ammo: {gameState.ammo}</div>
            <div>Score: {gameState.score}</div>
            <div>Enemies: {gameState.enemies.length}</div>
          </div>
          
          {/* Messages */}
          <div className="border border-gray-600 p-2 flex-1 overflow-y-auto">
            <div className="text-yellow-400 mb-2">MESSAGES</div>
            {messages.slice(-15).map((msg, i) => (
              <div key={i} className="text-xs mb-1">{msg}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        Arrow Keys: Move | CTRL: Shoot | ESC: Exit | Find Exit (E) to win!
      </div>
    </div>
  );
};