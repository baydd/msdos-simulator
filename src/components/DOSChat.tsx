import React, { useState, useEffect, useRef } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface DOSChatProps {
  onExit: () => void;
}

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

export const DOSChat: React.FC<DOSChatProps> = ({ onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      user: 'SYSTEM',
      message: 'Welcome to DOS-CHAT v1.0 - The first DOS-based chat system!',
      timestamp: new Date(),
      isSystem: true
    },
    {
      user: 'SYSTEM',
      message: 'Connected to BBS: RETRO-NET (555) 123-4567',
      timestamp: new Date(),
      isSystem: true
    },
    {
      user: 'SYSOP',
      message: 'Welcome to the board! Type /help for commands.',
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [username] = useState('USER' + Math.floor(Math.random() * 1000));
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses = [
    "That's interesting! Tell me more.",
    "I remember when computers had 640K of RAM and that was enough!",
    "Have you tried turning it off and on again? 😄",
    "Back in my day, we had to walk uphill both ways to connect to the internet!",
    "BEEP BOOP! I'm just a simple DOS bot.",
    "Error 404: Sense of humor not found. Just kidding!",
    "I'm running on a 486 DX2-66. What's your setup?",
    "Remember when downloading a 1MB file took 30 minutes?",
    "ASCII art was the original emoji! :-)",
    "I miss the sound of dial-up modems..."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Simulate other users joining/chatting
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const users = ['HACKER90', 'GAMER_X', 'BBS_ADMIN', 'RETRO_FAN', 'DOS_MASTER'];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        setMessages(prev => [...prev, {
          user: randomUser,
          message: randomResponse,
          timestamp: new Date()
        }]);
        
        dosSoundManager.playBeep(600, 100);
      }
    }, 10000 + Math.random() * 20000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      user: username,
      message: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    dosSoundManager.playBeep(800, 100);

    // Handle commands
    if (currentMessage.startsWith('/')) {
      handleCommand(currentMessage);
    }

    setCurrentMessage('');
  };

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase();
    
    if (cmd === '/help') {
      setMessages(prev => [...prev, {
        user: 'SYSTEM',
        message: 'Commands: /help /time /users /quit /ascii /modem',
        timestamp: new Date(),
        isSystem: true
      }]);
    } else if (cmd === '/time') {
      setMessages(prev => [...prev, {
        user: 'SYSTEM',
        message: `Current time: ${new Date().toLocaleString()}`,
        timestamp: new Date(),
        isSystem: true
      }]);
    } else if (cmd === '/users') {
      setMessages(prev => [...prev, {
        user: 'SYSTEM',
        message: 'Online users: HACKER90, GAMER_X, BBS_ADMIN, RETRO_FAN, DOS_MASTER, ' + username,
        timestamp: new Date(),
        isSystem: true
      }]);
    } else if (cmd === '/ascii') {
      setMessages(prev => [...prev, {
        user: 'SYSTEM',
        message: `
   ___  ___  ___ 
  |   \\|   \\/ __|
  | |) | |) \\__ \\
  |___/|___/|___/
        `,
        timestamp: new Date(),
        isSystem: true
      }]);
    } else if (cmd === '/modem') {
      setMessages(prev => [...prev, {
        user: 'SYSTEM',
        message: 'ATDT 555-1234... CONNECT 14400... CARRIER DETECTED',
        timestamp: new Date(),
        isSystem: true
      }]);
      dosSoundManager.playBeep(1200, 2000);
    } else if (cmd === '/quit') {
      onExit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    } else if (e.key === 'Escape') {
      onExit();
    }
  };

  return (
    <div className="h-full bg-black text-green-400 dos-font p-2 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-green-400 pb-2 mb-2">
        <div className="text-center text-yellow-400">
          ██████╗  ██████╗ ███████╗      ██████╗██╗  ██╗ █████╗ ████████╗
        </div>
        <div className="text-center text-yellow-400">
          ██╔══██╗██╔═══██╗██╔════╝     ██╔════╝██║  ██║██╔══██╗╚══██╔══╝
        </div>
        <div className="text-center text-yellow-400">
          ██║  ██║██║   ██║███████╗     ██║     ███████║███████║   ██║   
        </div>
        <div className="text-center text-yellow-400">
          ██║  ██║██║   ██║╚════██║     ██║     ██╔══██║██╔══██║   ██║   
        </div>
        <div className="text-center text-yellow-400">
          ██████╔╝╚██████╔╝███████║     ╚██████╗██║  ██║██║  ██║   ██║   
        </div>
        <div className="text-center text-green-400 mt-2">
          BBS Chat System v1.0 - Connected as: {username}
        </div>
        <div className="text-center text-gray-400 text-sm">
          Status: {isConnected ? 'ONLINE' : 'OFFLINE'} | Baud Rate: 14400 | Users Online: 6
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-2 border border-green-400 p-2">
        {messages.map((msg, index) => (
          <div key={index} className="mb-1">
            <span className={msg.isSystem ? 'text-yellow-400' : 'text-cyan-400'}>
              [{msg.timestamp.toLocaleTimeString()}] {msg.user}:
            </span>
            <span className="ml-2 text-green-400">{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-green-400 pt-2">
        <div className="flex items-center">
          <span className="text-cyan-400 mr-2">{username}:</span>
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-black text-green-400 outline-none border-none font-mono"
            placeholder="Type your message... (ESC to exit)"
            autoFocus
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Commands: /help /time /users /ascii /modem /quit | ENTER: Send | ESC: Exit
        </div>
      </div>
    </div>
  );
};