import React, { useEffect, useState } from 'react';
import { dosSoundManager } from '../utils/dosSounds';

interface BootSequenceProps {
  onBootComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onBootComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const bootMessages = [
    'Phoenix BIOS 4.0 Release 6.0',
    'Copyright (C) 1985-1994, Phoenix Technologies Ltd.',
    'All Rights Reserved',
    '',
    'CPU: Intel 80486 DX2-66',
    'Memory Test: 640K OK',
    'Extended Memory: 7168K OK',
    '',
    'Floppy disk(s) fail (40)',
    'KEYBOARD ERROR OR NO KEYBOARD PRESENT',
    'Press F1 to continue, DEL to enter SETUP',
    '',
    'Auto-detecting Pri Master..IDE Hard Disk',
    'Auto-detecting Pri Slave...Not Detected',
    'Auto-detecting Sec Master...Not Detected', 
    'Auto-detecting Sec Slave...Not Detected',
    '',
    'Pri Master: WDC AC2850F',
    '            LBA, Normal, 850 MB',
    '',
    'Starting MS-DOS...',
    '',
    'Microsoft(R) MS-DOS(R) Version 6.22',
    '             (C)Copyright Microsoft Corp 1981-1994.',
    '',
    'C:\\AUTOEXEC.BAT',
    'PATH C:\\DOS;C:\\WINDOWS',
    'SET TEMP=C:\\TEMP',
    'SET TMP=C:\\TEMP',
    'MS-DOS 6.22 Startup Complete',
    ''
  ];

  useEffect(() => {
    dosSoundManager.playBootSound();
    
    const interval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev >= bootMessages.length - 1) {
          setTimeout(onBootComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [onBootComplete]);

  return (
    <div className="h-full w-full flex items-start justify-start bg-black p-4">
      <div className="dos-font text-white text-base leading-relaxed max-w-full">
        {bootMessages.slice(0, currentLine + 1).map((message, index) => (
          <div key={index} className="mb-1">
            {message}
            {index === currentLine && showCursor && (
              <span className="bg-white text-black ml-1">█</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};