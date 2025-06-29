import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DOSState } from '../types';
import { dosCommands } from '../commands/dosCommands';
import { createDOSFileSystem } from '../utils/dosFileSystem';
import { dosSoundManager } from '../utils/dosSounds';
import { DoomGame } from '../games/DoomGame';
import { PrinceOfPersiaGame } from '../games/PrinceOfPersiaGame';
import { PacManGame } from '../games/PacManGame';
import { SnakeGame } from '../games/SnakeGame';
import { TetrisGame } from '../games/TetrisGame';
import { DOSBrowser } from './DOSBrowser';

export const DOSScreen: React.FC = () => {
  const [dosState, setDosState] = useState<DOSState>({
    currentDrive: 'C',
    currentPath: '\\',
    fileSystem: createDOSFileSystem(),
    screenBuffer: [
      'Microsoft(R) MS-DOS(R) Version 6.22',
      '             (C)Copyright Microsoft Corp 1981-1994.',
      '',
      'Type HELP for available commands.',
      'Type CREDITS to see developer information.',
      '',
      'C:\\>'
    ],
    cursorPosition: { x: 4, y: 6 },
    currentProgram: null
  });

  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
    dosSoundManager.playBootSound();
  }, [focusInput]);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [dosState.screenBuffer]);

  const executeCommand = useCallback((commandLine: string) => {
    const trimmed = commandLine.trim().toUpperCase();
    if (!trimmed) return;

    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add command to screen buffer
    const prompt = `${dosState.currentDrive}:${dosState.currentPath}>`;
    const newBuffer = [...dosState.screenBuffer];
    newBuffer[newBuffer.length - 1] = prompt + commandLine;

    const [commandName, ...args] = trimmed.split(' ');
    const command = dosCommands.find(cmd => cmd.name.toUpperCase() === commandName);

    if (command) {
      const result = command.execute(args, dosState);
      
      if (result.clearScreen) {
        setDosState(prev => ({
          ...prev,
          screenBuffer: [`${prev.currentDrive}:${prev.currentPath}>`],
          cursorPosition: { x: 4, y: 0 }
        }));
      } else if (result.program) {
        setDosState(prev => ({
          ...prev,
          currentProgram: result.program,
          screenBuffer: [...newBuffer, ...(result.output || [])]
        }));
      } else {
        const updatedState = {
          ...dosState,
          ...result.newState,
          screenBuffer: [...newBuffer, ...(result.output || []), `${dosState.currentDrive}:${dosState.currentPath}>`]
        };
        setDosState(updatedState);
      }
    } else {
      // Check if it's a file execution
      if (commandName.endsWith('.EXE') || commandName.endsWith('.COM') || commandName.endsWith('.BAT')) {
        if (commandName === 'DOOM.EXE') {
          setDosState(prev => ({
            ...prev,
            currentProgram: 'doom',
            screenBuffer: [...newBuffer, 'Starting DOOM...']
          }));
        } else if (commandName === 'PRINCE.EXE') {
          setDosState(prev => ({
            ...prev,
            currentProgram: 'prince',
            screenBuffer: [...newBuffer, 'Starting Prince of Persia...']
          }));
        } else if (commandName === 'PACMAN.EXE') {
          setDosState(prev => ({
            ...prev,
            currentProgram: 'pacman',
            screenBuffer: [...newBuffer, 'Starting Pac-Man...']
          }));
        } else if (commandName === 'SNAKE.EXE') {
          setDosState(prev => ({
            ...prev,
            currentProgram: 'snake',
            screenBuffer: [...newBuffer, 'Starting Snake...']
          }));
        } else if (commandName === 'TETRIS.EXE') {
          setDosState(prev => ({
            ...prev,
            currentProgram: 'tetris',
            screenBuffer: [...newBuffer, 'Starting Tetris...']
          }));
        } else {
          setDosState(prev => ({
            ...prev,
            screenBuffer: [...newBuffer, 'Bad command or file name', `${prev.currentDrive}:${prev.currentPath}>`]
          }));
        }
      } else {
        setDosState(prev => ({
          ...prev,
          screenBuffer: [...newBuffer, 'Bad command or file name', `${prev.currentDrive}:${prev.currentPath}>`]
        }));
      }
    }
  }, [dosState]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    dosSoundManager.playKeypress();

    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  }, [currentInput, commandHistory, historyIndex, executeCommand]);

  const exitProgram = useCallback(() => {
    setDosState(prev => ({
      ...prev,
      currentProgram: null,
      screenBuffer: [...prev.screenBuffer, `${prev.currentDrive}:${prev.currentPath}>`]
    }));
  }, []);

  // Render different programs based on current program
  if (dosState.currentProgram === 'doom') {
    return <DoomGame onExit={exitProgram} />;
  }
  
  if (dosState.currentProgram === 'prince') {
    return <PrinceOfPersiaGame onExit={exitProgram} />;
  }
  
  if (dosState.currentProgram === 'pacman') {
    return <PacManGame onExit={exitProgram} />;
  }
  
  if (dosState.currentProgram === 'snake') {
    return <SnakeGame onExit={exitProgram} />;
  }
  
  if (dosState.currentProgram === 'tetris') {
    return <TetrisGame onExit={exitProgram} />;
  }

  if (dosState.currentProgram === 'browser') {
    return <DOSBrowser onExit={exitProgram} />;
  }

  return (
    <div className="h-screen bg-black text-white dos-font overflow-hidden flex flex-col">
      {/* DOS Screen */}
      <div 
        ref={screenRef}
        className="flex-1 p-2 overflow-y-auto cursor-text font-mono"
        onClick={focusInput}
        style={{ 
          backgroundColor: '#000080',
          color: '#FFFFFF',
          fontFamily: 'Courier New, monospace',
          fontSize: '16px',
          lineHeight: '1.2'
        }}
      >
        {dosState.screenBuffer.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
            {index === dosState.screenBuffer.length - 1 && (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-white outline-none border-none font-mono"
                  style={{ 
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    width: `${Math.max(currentInput.length + 1, 1)}ch`
                  }}
                  autoFocus
                />
                <span className="animate-pulse bg-white text-black">█</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 text-gray-300 px-2 py-1 text-xs flex justify-between">
        <span>MS-DOS 6.22 Simulator - Created by Your Name (2025)</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};