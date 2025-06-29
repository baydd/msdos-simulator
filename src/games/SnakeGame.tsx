import React, { useState, useEffect, useCallback } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface SnakeGameProps {
  onExit: () => void;
}

interface SnakeGameState {
  snake: Array<{ x: number; y: number }>;
  food: { x: number; y: number };
  direction: 'up' | 'down' | 'left' | 'right';
  score: number;
  gameRunning: boolean;
  speed: number;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
  const BOARD_SIZE = 20;
  
  const [gameState, setGameState] = useState<SnakeGameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'right',
    score: 0,
    gameRunning: true,
    speed: 200
  });

  const generateFood = useCallback((snake: Array<{ x: number; y: number }>) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameRunning) return prev;
      
      const head = prev.snake[0];
      let newHead = { ...head };
      
      switch (prev.direction) {
        case 'up': newHead.y--; break;
        case 'down': newHead.y++; break;
        case 'left': newHead.x--; break;
        case 'right': newHead.x++; break;
      }
      
      // Check wall collision
      if (newHead.x < 0 || newHead.x >= BOARD_SIZE || 
          newHead.y < 0 || newHead.y >= BOARD_SIZE) {
        dosSoundManager.playBeep(200, 500);
        return { ...prev, gameRunning: false };
      }
      
      // Check self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        dosSoundManager.playBeep(200, 500);
        return { ...prev, gameRunning: false };
      }
      
      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;
      let newSpeed = prev.speed;
      
      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        dosSoundManager.playBeep(800, 100);
        newFood = generateFood(newSnake);
        newScore += 10;
        newSpeed = Math.max(50, newSpeed - 5); // Increase speed
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }
      
      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        speed: newSpeed
      };
    });
  }, [generateFood]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameState.gameRunning) return;
    
    setGameState(prev => {
      let newDirection = prev.direction;
      
      switch (e.key) {
        case 'ArrowUp':
          if (prev.direction !== 'down') newDirection = 'up';
          break;
        case 'ArrowDown':
          if (prev.direction !== 'up') newDirection = 'down';
          break;
        case 'ArrowLeft':
          if (prev.direction !== 'right') newDirection = 'left';
          break;
        case 'ArrowRight':
          if (prev.direction !== 'left') newDirection = 'right';
          break;
        case 'Escape':
          onExit();
          return prev;
        case ' ':
          // Restart game
          return {
            snake: [{ x: 10, y: 10 }],
            food: { x: 15, y: 15 },
            direction: 'right',
            score: 0,
            gameRunning: true,
            speed: 200
          };
      }
      
      return { ...prev, direction: newDirection };
    });
  }, [gameState.gameRunning, onExit]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const interval = setInterval(moveSnake, gameState.speed);
    return () => clearInterval(interval);
  }, [moveSnake, gameState.speed]);

  const renderBoard = () => {
    const board = [];
    
    for (let y = 0; y < BOARD_SIZE; y++) {
      const row = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        let char = '·';
        let color = 'text-gray-600';
        
        // Snake head
        if (gameState.snake[0].x === x && gameState.snake[0].y === y) {
          char = '●';
          color = 'text-green-400';
        }
        // Snake body
        else if (gameState.snake.slice(1).some(segment => segment.x === x && segment.y === y)) {
          char = '█';
          color = 'text-green-300';
        }
        // Food
        else if (gameState.food.x === x && gameState.food.y === y) {
          char = '♦';
          color = 'text-red-400';
        }
        
        row.push(
          <span key={x} className={`${color} w-4`}>
            {char}
          </span>
        );
      }
      board.push(
        <div key={y} className="flex">
          {row}
        </div>
      );
    }
    
    return board;
  };

  return (
    <div className="h-full bg-black text-white dos-font p-4 overflow-hidden">
      <div className="text-center mb-4">
        <div className="text-green-400 text-xl mb-2">
          ███████╗███╗   ██╗ █████╗ ██╗  ██╗███████╗
        </div>
        <div className="text-green-400 text-xl mb-2">
          ██╔════╝████╗  ██║██╔══██╗██║ ██╔╝██╔════╝
        </div>
        <div className="text-green-400 text-xl mb-2">
          ███████╗██╔██╗ ██║███████║█████╔╝ █████╗  
        </div>
        <div className="text-green-400 text-xl mb-2">
          ╚════██║██║╚██╗██║██╔══██║██╔═██╗ ██╔══╝  
        </div>
        <div className="text-green-400 text-xl mb-4">
          ███████║██║ ╚████║██║  ██║██║  ██╗███████╗
        </div>
        
        <div className="text-yellow-400">
          Score: {gameState.score} | Length: {gameState.snake.length} | Speed: {Math.floor((250 - gameState.speed) / 10)}
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="border border-green-400 p-2">
          <div className="font-mono text-sm leading-none">
            {renderBoard()}
          </div>
        </div>
      </div>
      
      {!gameState.gameRunning && (
        <div className="text-center mt-4">
          <div className="text-red-400 text-xl mb-2">GAME OVER!</div>
          <div className="text-yellow-400">Final Score: {gameState.score}</div>
          <div className="text-gray-400 mt-2">Press SPACE to restart | ESC to exit</div>
        </div>
      )}
      
      <div className="text-center mt-4 text-xs text-gray-400">
        Arrow Keys: Move | SPACE: Restart | ESC: Exit
      </div>
    </div>
  );
};