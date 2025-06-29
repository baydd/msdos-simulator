import { DOSFile } from '../types';

export const createDOSFileSystem = (): { [drive: string]: DOSFile } => {
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: '2-digit' 
  }).replace(/\//g, '-');
  const timeStr = currentDate.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return {
    'C': {
      name: '',
      extension: '',
      type: 'directory',
      size: 0,
      date: dateStr,
      time: timeStr,
      attributes: '<DIR>',
      children: [
        {
          name: 'DOS',
          extension: '',
          type: 'directory',
          size: 0,
          date: dateStr,
          time: timeStr,
          attributes: '<DIR>',
          children: [
            {
              name: 'COMMAND',
              extension: 'COM',
              type: 'file',
              size: 47845,
              date: '03-10-93',
              time: '06:00',
              attributes: '',
              content: 'MS-DOS Command Interpreter'
            },
            {
              name: 'FORMAT',
              extension: 'COM',
              type: 'file',
              size: 22717,
              date: '03-10-93',
              time: '06:00',
              attributes: '',
              content: 'Disk Format Utility'
            },
            {
              name: 'FDISK',
              extension: 'EXE',
              type: 'file',
              size: 29334,
              date: '03-10-93',
              time: '06:00',
              attributes: '',
              content: 'Fixed Disk Setup Program'
            }
          ]
        },
        {
          name: 'GAMES',
          extension: '',
          type: 'directory',
          size: 0,
          date: dateStr,
          time: timeStr,
          attributes: '<DIR>',
          children: [
            {
              name: 'DOOM',
              extension: '',
              type: 'directory',
              size: 0,
              date: '12-10-93',
              time: '12:00',
              attributes: '<DIR>',
              children: [
                {
                  name: 'DOOM',
                  extension: 'EXE',
                  type: 'file',
                  size: 721024,
                  date: '12-10-93',
                  time: '12:00',
                  attributes: '',
                  content: 'DOOM Game Executable'
                },
                {
                  name: 'DOOM1',
                  extension: 'WAD',
                  type: 'file',
                  size: 11159840,
                  date: '12-10-93',
                  time: '12:00',
                  attributes: '',
                  content: 'DOOM Game Data'
                },
                {
                  name: 'README',
                  extension: 'TXT',
                  type: 'file',
                  size: 2847,
                  date: '12-10-93',
                  time: '12:00',
                  attributes: '',
                  content: 'DOOM v1.0 Shareware\n\nWelcome to DOOM!\n\nYou are a space marine stationed on Mars when all hell breaks loose.\nFight your way through hordes of demons and escape alive!\n\nControls:\nArrow Keys - Move\nCtrl - Fire\nAlt - Strafe\nSpace - Open doors\nTab - Map\n\nGood luck, marine!'
                }
              ]
            },
            {
              name: 'PRINCE',
              extension: '',
              type: 'directory',
              size: 0,
              date: '10-03-89',
              time: '14:30',
              attributes: '<DIR>',
              children: [
                {
                  name: 'PRINCE',
                  extension: 'EXE',
                  type: 'file',
                  size: 58880,
                  date: '10-03-89',
                  time: '14:30',
                  attributes: '',
                  content: 'Prince of Persia Game'
                },
                {
                  name: 'README',
                  extension: 'TXT',
                  type: 'file',
                  size: 1024,
                  date: '10-03-89',
                  time: '14:30',
                  attributes: '',
                  content: 'Prince of Persia v1.0\n\nSave the Princess!\n\nYou have 60 minutes to navigate through the dungeon,\navoid traps, fight guards, and rescue the princess.\n\nControls:\nArrow Keys - Move/Jump\nShift - Run\nCtrl - Draw Sword\n\nGood luck, Prince!'
                }
              ]
            },
            {
              name: 'ARCADE',
              extension: '',
              type: 'directory',
              size: 0,
              date: '01-15-92',
              time: '10:00',
              attributes: '<DIR>',
              children: [
                {
                  name: 'PACMAN',
                  extension: 'EXE',
                  type: 'file',
                  size: 32768,
                  date: '01-15-92',
                  time: '10:00',
                  attributes: '',
                  content: 'Pac-Man Game'
                },
                {
                  name: 'SNAKE',
                  extension: 'EXE',
                  type: 'file',
                  size: 16384,
                  date: '05-20-91',
                  time: '15:30',
                  attributes: '',
                  content: 'Snake Game'
                },
                {
                  name: 'TETRIS',
                  extension: 'EXE',
                  type: 'file',
                  size: 45056,
                  date: '06-06-89',
                  time: '09:15',
                  attributes: '',
                  content: 'Tetris Game'
                }
              ]
            }
          ]
        },
        {
          name: 'WINDOWS',
          extension: '',
          type: 'directory',
          size: 0,
          date: '05-31-94',
          time: '09:50',
          attributes: '<DIR>',
          children: [
            {
              name: 'WIN',
              extension: 'COM',
              type: 'file',
              size: 18967,
              date: '05-31-94',
              time: '09:50',
              attributes: '',
              content: 'Windows 3.1 Loader'
            }
          ]
        },
        {
          name: 'AUTOEXEC',
          extension: 'BAT',
          type: 'file',
          size: 128,
          date: dateStr,
          time: timeStr,
          attributes: '',
          content: '@ECHO OFF\nPATH C:\\DOS;C:\\WINDOWS\nSET TEMP=C:\\TEMP\nSET TMP=C:\\TEMP\nECHO MS-DOS 6.22 Startup Complete'
        },
        {
          name: 'CONFIG',
          extension: 'SYS',
          type: 'file',
          size: 256,
          date: dateStr,
          time: timeStr,
          attributes: '',
          content: 'DEVICE=C:\\DOS\\HIMEM.SYS\nDEVICE=C:\\DOS\\EMM386.EXE\nDOS=HIGH,UMB\nFILES=30\nBUFFERS=20'
        }
      ]
    },
    'A': {
      name: '',
      extension: '',
      type: 'directory',
      size: 0,
      date: dateStr,
      time: timeStr,
      attributes: '<DIR>',
      children: []
    }
  };
};

export const findDOSItem = (path: string, drive: string, fileSystem: { [drive: string]: DOSFile }): DOSFile | null => {
  if (!fileSystem[drive]) return null;
  
  if (path === '\\' || path === '') return fileSystem[drive];
  
  const parts = path.split('\\').filter(p => p !== '');
  let current = fileSystem[drive];
  
  for (const part of parts) {
    if (!current.children) return null;
    const found = current.children.find(child => 
      child.name.toUpperCase() === part.toUpperCase()
    );
    if (!found) return null;
    current = found;
  }
  
  return current;
};

export const resolveDOSPath = (currentPath: string, targetPath: string): string => {
  if (targetPath.includes(':')) {
    return targetPath.substring(2) || '\\';
  }
  
  if (targetPath.startsWith('\\')) {
    return targetPath;
  }
  
  if (targetPath === '.') {
    return currentPath;
  }
  
  if (targetPath === '..') {
    const parts = currentPath.split('\\').filter(p => p !== '');
    parts.pop();
    return '\\' + parts.join('\\');
  }
  
  if (currentPath === '\\') {
    return '\\' + targetPath;
  }
  
  return currentPath + '\\' + targetPath;
};