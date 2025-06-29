import { DOSCommand, DOSState } from '../types';
import { findDOSItem, resolveDOSPath } from '../utils/dosFileSystem';
import { dosSoundManager } from '../utils/dosSounds';

const dirCommand: DOSCommand = {
  name: 'dir',
  description: 'Display directory contents',
  execute: (args, state) => {
    const targetPath = args.length > 0 ? resolveDOSPath(state.currentPath, args[0]) : state.currentPath;
    const item = findDOSItem(targetPath, state.currentDrive, state.fileSystem);
    
    if (!item) {
      return { output: ['File not found'] };
    }
    
    if (item.type === 'file') {
      return { 
        output: [
          ` Volume in drive ${state.currentDrive} has no label`,
          ` Volume Serial Number is 1234-5678`,
          '',
          ` Directory of ${state.currentDrive}:${targetPath}`,
          '',
          `${item.date}  ${item.time}    ${item.size.toString().padStart(8)} ${item.name}.${item.extension}`,
          `               1 File(s)    ${item.size} bytes`,
          `               0 Dir(s)   1,457,664 bytes free`
        ]
      };
    }
    
    if (!item.children) {
      return { 
        output: [
          ` Volume in drive ${state.currentDrive} has no label`,
          ` Volume Serial Number is 1234-5678`,
          '',
          ` Directory of ${state.currentDrive}:${targetPath}`,
          '',
          '               0 File(s)         0 bytes',
          '               0 Dir(s)   1,457,664 bytes free'
        ]
      };
    }
    
    const output = [
      ` Volume in drive ${state.currentDrive} has no label`,
      ` Volume Serial Number is 1234-5678`,
      '',
      ` Directory of ${state.currentDrive}:${targetPath}`,
      ''
    ];
    
    // Add . and .. entries for subdirectories
    if (targetPath !== '\\') {
      output.push('.          <DIR>         ' + new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '-') + '  ' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
      output.push('..         <DIR>         ' + new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '-') + '  ' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    }
    
    let totalFiles = 0;
    let totalSize = 0;
    let totalDirs = 0;
    
    item.children.forEach(child => {
      const name = child.type === 'directory' 
        ? child.name.padEnd(8) + ' <DIR>        '
        : (child.name + '.' + child.extension).padEnd(12) + ' ';
      
      const size = child.type === 'directory' 
        ? '        '
        : child.size.toString().padStart(8);
      
      output.push(`${name} ${size} ${child.date}  ${child.time}`);
      
      if (child.type === 'file') {
        totalFiles++;
        totalSize += child.size;
      } else {
        totalDirs++;
      }
    });
    
    output.push('');
    output.push(`              ${totalFiles} File(s)    ${totalSize} bytes`);
    output.push(`              ${totalDirs} Dir(s)   1,457,664 bytes free`);
    
    return { output };
  }
};

const cdCommand: DOSCommand = {
  name: 'cd',
  description: 'Change directory',
  execute: (args, state) => {
    if (args.length === 0) {
      return { output: [state.currentDrive + ':' + state.currentPath] };
    }
    
    const targetPath = resolveDOSPath(state.currentPath, args[0]);
    const item = findDOSItem(targetPath, state.currentDrive, state.fileSystem);
    
    if (!item) {
      return { output: ['Invalid directory'] };
    }
    
    if (item.type !== 'directory') {
      return { output: ['Invalid directory'] };
    }
    
    return {
      output: [],
      newState: { currentPath: targetPath }
    };
  }
};

const typeCommand: DOSCommand = {
  name: 'type',
  description: 'Display file contents',
  execute: (args, state) => {
    if (args.length === 0) {
      return { output: ['Required parameter missing'] };
    }
    
    const targetPath = resolveDOSPath(state.currentPath, args[0]);
    const pathParts = targetPath.split('\\');
    const fileName = pathParts.pop() || '';
    const dirPath = pathParts.join('\\') || '\\';
    
    const dir = findDOSItem(dirPath, state.currentDrive, state.fileSystem);
    if (!dir || !dir.children) {
      return { output: ['File not found'] };
    }
    
    const file = dir.children.find(child => {
      const fullName = child.extension ? `${child.name}.${child.extension}` : child.name;
      return fullName.toUpperCase() === fileName.toUpperCase();
    });
    
    if (!file || file.type === 'directory') {
      return { output: ['File not found'] };
    }
    
    return { output: (file.content || '').split('\n') };
  }
};

const clsCommand: DOSCommand = {
  name: 'cls',
  description: 'Clear screen',
  execute: () => {
    return { clearScreen: true, output: [] };
  }
};

const helpCommand: DOSCommand = {
  name: 'help',
  description: 'Display help information',
  execute: () => {
    return {
      output: [
        'For more information on a specific command, type HELP command-name',
        '',
        'BROWSE         Opens the web browser.',
        'CD             Displays the name of or changes the current directory.',
        'CLS            Clears the screen.',
        'COPY           Copies one or more files to another location.',
        'DATE           Displays or sets the date.',
        'DEL            Deletes one or more files.',
        'DIR            Displays a list of files and subdirectories in a directory.',
        'ECHO           Displays messages, or turns command-echoing on or off.',
        'EXIT           Quits the MS-DOS command interpreter.',
        'FORMAT         Formats a disk for use with MS-DOS.',
        'HELP           Provides Help information for MS-DOS commands.',
        'MD             Creates a directory.',
        'RD             Removes a directory.',
        'REN            Renames a file or files.',
        'TIME           Displays or sets the system time.',
        'TYPE           Displays the contents of a text file.',
        'VER            Displays the MS-DOS version.',
        'VOL            Displays a disk volume label and serial number.'
      ]
    };
  }
};

const verCommand: DOSCommand = {
  name: 'ver',
  description: 'Display MS-DOS version',
  execute: () => {
    return { output: ['MS-DOS Version 6.22'] };
  }
};

const dateCommand: DOSCommand = {
  name: 'date',
  description: 'Display or set date',
  execute: () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: '2-digit',
      day: '2-digit',
      year: '4-digit'
    });
    return { output: [`Current date is ${dateStr}`, 'Enter new date (mm-dd-yy): '] };
  }
};

const timeCommand: DOSCommand = {
  name: 'time',
  description: 'Display or set time',
  execute: () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    return { output: [`Current time is ${timeStr}`, 'Enter new time: '] };
  }
};

const echoCommand: DOSCommand = {
  name: 'echo',
  description: 'Display message',
  execute: (args) => {
    if (args.length === 0) {
      return { output: ['ECHO is on'] };
    }
    return { output: [args.join(' ')] };
  }
};

const memCommand: DOSCommand = {
  name: 'mem',
  description: 'Display memory usage',
  execute: () => {
    return {
      output: [
        'Memory Type        Total       Used       Free',
        '----------------  --------   --------   --------',
        'Conventional         640K       128K       512K',
        'Upper                384K       256K       128K',
        'Reserved             384K       384K         0K',
        'Extended (XMS)     7,168K         0K     7,168K',
        '----------------  --------   --------   --------',
        'Total memory       8,576K       768K     7,808K',
        '',
        'Total under 1 MB     640K       128K       512K',
        '',
        'Largest executable program size       512K (524,288 bytes)',
        'Largest free upper memory block       128K (131,072 bytes)',
        'MS-DOS is resident in the high memory area.'
      ]
    };
  }
};

// Web Browser Command
const browseCommand: DOSCommand = {
  name: 'browse',
  description: 'Launch web browser',
  execute: () => {
    return {
      output: ['Starting Netscape Navigator 3.0...'],
      program: 'browser'
    };
  }
};

// Game launchers
const doomCommand: DOSCommand = {
  name: 'doom',
  description: 'Launch DOOM',
  execute: (args, state) => {
    // Check if we're in the DOOM directory or if DOOM.EXE exists
    const currentDir = findDOSItem(state.currentPath, state.currentDrive, state.fileSystem);
    const doomExe = currentDir?.children?.find(child => 
      child.name.toUpperCase() === 'DOOM' && child.extension.toUpperCase() === 'EXE'
    );
    
    if (!doomExe) {
      return { output: ['Bad command or file name'] };
    }
    
    return {
      output: ['Starting DOOM...'],
      program: 'doom'
    };
  }
};

const princeCommand: DOSCommand = {
  name: 'prince',
  description: 'Launch Prince of Persia',
  execute: (args, state) => {
    const currentDir = findDOSItem(state.currentPath, state.currentDrive, state.fileSystem);
    const princeExe = currentDir?.children?.find(child => 
      child.name.toUpperCase() === 'PRINCE' && child.extension.toUpperCase() === 'EXE'
    );
    
    if (!princeExe) {
      return { output: ['Bad command or file name'] };
    }
    
    return {
      output: ['Starting Prince of Persia...'],
      program: 'prince'
    };
  }
};

const pacmanCommand: DOSCommand = {
  name: 'pacman',
  description: 'Launch Pac-Man',
  execute: (args, state) => {
    const currentDir = findDOSItem(state.currentPath, state.currentDrive, state.fileSystem);
    const pacmanExe = currentDir?.children?.find(child => 
      child.name.toUpperCase() === 'PACMAN' && child.extension.toUpperCase() === 'EXE'
    );
    
    if (!pacmanExe) {
      return { output: ['Bad command or file name'] };
    }
    
    return {
      output: ['Starting Pac-Man...'],
      program: 'pacman'
    };
  }
};

const snakeCommand: DOSCommand = {
  name: 'snake',
  description: 'Launch Snake',
  execute: (args, state) => {
    const currentDir = findDOSItem(state.currentPath, state.currentDrive, state.fileSystem);
    const snakeExe = currentDir?.children?.find(child => 
      child.name.toUpperCase() === 'SNAKE' && child.extension.toUpperCase() === 'EXE'
    );
    
    if (!snakeExe) {
      return { output: ['Bad command or file name'] };
    }
    
    return {
      output: ['Starting Snake...'],
      program: 'snake'
    };
  }
};

const tetrisCommand: DOSCommand = {
  name: 'tetris',
  description: 'Launch Tetris',
  execute: (args, state) => {
    const currentDir = findDOSItem(state.currentPath, state.currentDrive, state.fileSystem);
    const tetrisExe = currentDir?.children?.find(child => 
      child.name.toUpperCase() === 'TETRIS' && child.extension.toUpperCase() === 'EXE'
    );
    
    if (!tetrisExe) {
      return { output: ['Bad command or file name'] };
    }
    
    return {
      output: ['Starting Tetris...'],
      program: 'tetris'
    };
  }
};

const winCommand: DOSCommand = {
  name: 'win',
  description: 'Start Windows',
  execute: () => {
    return {
      output: [
        'Starting Windows...',
        '',
        '██╗    ██╗██╗███╗   ██╗██████╗  ██████╗ ██╗    ██╗███████╗',
        '██║    ██║██║████╗  ██║██╔══██╗██╔═══██╗██║    ██║██╔════╝',
        '██║ █╗ ██║██║██╔██╗ ██║██║  ██║██║   ██║██║ █╗ ██║███████╗',
        '██║███╗██║██║██║╚██╗██║██║  ██║██║   ██║██║███╗██║╚════██║',
        '╚███╔███╔╝██║██║ ╚████║██████╔╝╚██████╔╝╚███╔███╔╝███████║',
        ' ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝  ╚══╝╚══╝ ╚══════╝',
        '',
        'Microsoft Windows 3.1',
        'Copyright (C) Microsoft Corp 1985-1992',
        '',
        'Just kidding! This is a DOS simulator.',
        'Windows 3.1 would take forever to load anyway... 😄'
      ]
    };
  }
};

// Easter eggs
const formatCommand: DOSCommand = {
  name: 'format',
  description: 'Format disk',
  execute: (args) => {
    if (args.includes('c:')) {
      dosSoundManager.playBeep(1000, 2000);
      return {
        output: [
          'WARNING: ALL DATA ON NON-REMOVABLE DISK',
          'DRIVE C: WILL BE LOST!',
          'Proceed with Format (Y/N)?',
          '',
          'Just kidding! This is a simulator.',
          'Your real hard drive is safe! 😅'
        ]
      };
    }
    return { output: ['Insert new diskette for drive A:', 'and press ENTER when ready...'] };
  }
};

const deltreeCommand: DOSCommand = {
  name: 'deltree',
  description: 'Delete directory tree',
  execute: (args) => {
    if (args.includes('c:\\') || args.includes('C:\\')) {
      return {
        output: [
          'Delete directory "C:\\" and all its subdirectories? [yn] ',
          '',
          'Haha! Nice try, but this is just a simulator!',
          'No real files were harmed in the making of this DOS. 😄'
        ]
      };
    }
    return { output: ['Delete directory "' + (args[0] || '') + '" and all its subdirectories? [yn] '] };
  }
};

// Credits command
const creditsCommand: DOSCommand = {
  name: 'credits',
  description: 'Show developer credits',
  execute: () => {
    return {
      output: [
        '╔══════════════════════════════════════════════════════════╗',
        '║                    MS-DOS 6.22 SIMULATOR                ║',
        '║                                                          ║',
        '║  A nostalgic recreation of the classic DOS experience    ║',
        '║                                                          ║',
        '║  Developer: Your Name                                    ║',
        '║  GitHub: https://github.com/yourusername                 ║',
        '║  Year: 2025                                              ║',
        '║  License: MIT                                            ║',
        '║                                                          ║',
        '║  Built with: React + TypeScript + Tailwind CSS          ║',
        '║                                                          ║',
        '║  Features:                                               ║',
        '║  • Authentic DOS commands and file system               ║',
        '║  • Classic games (DOOM, Prince of Persia, etc.)        ║',
        '║  • CRT monitor simulation with scanlines                ║',
        '║  • PC Speaker sound effects                             ║',
        '║  • Web browser integration                              ║',
        '║                                                          ║',
        '║  Experience the golden age of computing!                ║',
        '╚══════════════════════════════════════════════════════════╝'
      ]
    };
  }
};

export const dosCommands: DOSCommand[] = [
  dirCommand,
  cdCommand,
  typeCommand,
  clsCommand,
  helpCommand,
  verCommand,
  dateCommand,
  timeCommand,
  echoCommand,
  memCommand,
  browseCommand,
  doomCommand,
  princeCommand,
  pacmanCommand,
  snakeCommand,
  tetrisCommand,
  winCommand,
  formatCommand,
  deltreeCommand,
  creditsCommand
];