import React, { useState, useRef, useEffect, useCallback } from 'react';
import { commands } from '../commands';
import { SystemState, TerminalHistory } from '../types';
import { soundManager } from '../utils/sounds';

interface TerminalProps {
  windowId: string;
  systemState: SystemState;
  onSystemStateChange: (newState: Partial<SystemState>) => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  windowId,
  systemState,
  onSystemStateChange
}) => {
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (commandLine: string) => {
    const trimmed = commandLine.trim();
    if (!trimmed) return;

    const [commandName, ...args] = trimmed.split(' ');
    const command = commands.find(cmd => cmd.name === commandName);

    let output: string[];
    let newState: Partial<SystemState> = {};

    if (command) {
      const result = command.execute(args, systemState);
      output = result.output;
      if (result.newState) {
        newState = result.newState;
        onSystemStateChange(result.newState);
      }
    } else {
      if (commandName.endsWith('.sim')) {
        // Handle .sim files
        if (commandName === 'netscape.sim') {
          output = ['Starting Netscape Navigator...'];
          // TODO: Open browser window
        } else if (commandName === 'doom.sim') {
          output = [
            'Starting DOOM...',
            '',
            '████████╗ ██████╗  ██████╗ ███╗   ███╗',
            '██╔═══██║██╔═══██╗██╔═══██╗████╗ ████║',
            '██║   ██║██║   ██║██║   ██║██╔████╔██║',
            '██║   ██║██║   ██║██║   ██║██║╚██╔╝██║',
            '╚██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║',
            ' ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝',
            '',
            'RIP AND TEAR!',
            '(Just kidding, this is a retro simulator)',
            'Press any key to continue...'
          ];
        } else {
          output = [`${commandName}: permission denied or file not found`];
        }
      } else {
        output = [`${commandName}: command not found`];
      }
    }

    const newHistoryEntry: TerminalHistory = {
      command: trimmed,
      output,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, newHistoryEntry]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (systemState.soundEnabled) {
      soundManager.playKeypress();
    }

    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        if (newIndex === history.length - 1) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(history[newIndex].command);
        }
      }
    }
  };

  const renderOutput = (output: string[]) => {
    return output.map((line, index) => {
      // Handle special formatting
      if (line === '\x1b[2J\x1b[H') {
        // Clear screen command
        return null;
      }
      
      // Handle ANSI color codes (simplified)
      const coloredLine = line
        .replace(/\x1b\[34m(.*?)\x1b\[0m/g, '<span class="text-blue-400">$1</span>')
        .replace(/\x1b\[32m(.*?)\x1b\[0m/g, '<span class="text-green-400">$1</span>')
        .replace(/\x1b\[31m(.*?)\x1b\[0m/g, '<span class="text-red-400">$1</span>');
      
      return (
        <div 
          key={index} 
          className="text-green-400"
          dangerouslySetInnerHTML={{ __html: coloredLine }}
        />
      );
    });
  };

  const getPrompt = () => {
    const user = 'user';
    const hostname = 'ubuntu90s';
    const path = systemState.currentDirectory === '/home/user' ? '~' : systemState.currentDirectory;
    return `${user}@${hostname}:${path}$`;
  };

  return (
    <div 
      className="h-full bg-black text-green-400 font-mono text-sm p-4 overflow-hidden flex flex-col cursor-text"
      onClick={focusInput}
    >
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-2 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-black"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            <div className="text-green-300">
              <span className="text-green-500">{getPrompt()}</span>
              <span className="ml-2">{entry.command}</span>
            </div>
            <div className="ml-0">
              {renderOutput(entry.output)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center">
        <span className="text-green-500">{getPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ml-2 bg-transparent text-green-400 outline-none flex-1 font-mono"
          autoFocus
        />
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
};