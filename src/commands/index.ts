import { Command, SystemState } from '../types';
import { findItem, resolvePath, addItemToFileSystem } from '../utils/fileSystem';

const helpCommand: Command = {
  name: 'help',
  description: 'Show available commands',
  usage: 'help [command]',
  execute: (args) => {
    if (args.length > 0) {
      const cmd = commands.find(c => c.name === args[0]);
      if (cmd) {
        return {
          output: [
            `${cmd.name} - ${cmd.description}`,
            `Usage: ${cmd.usage}`
          ]
        };
      }
      return { output: [`Command '${args[0]}' not found`] };
    }
    
    return {
      output: [
        'Available commands:',
        ...commands.map(cmd => `  ${cmd.name.padEnd(12)} - ${cmd.description}`)
      ]
    };
  }
};

const lsCommand: Command = {
  name: 'ls',
  description: 'List directory contents',
  usage: 'ls [directory]',
  execute: (args, system) => {
    const targetPath = args.length > 0 ? resolvePath(system.currentDirectory, args[0]) : system.currentDirectory;
    const item = findItem(targetPath, system.fileSystem);
    
    if (!item) {
      return { output: [`ls: cannot access '${targetPath}': No such file or directory`] };
    }
    
    if (item.type === 'file') {
      return { output: [item.name] };
    }
    
    if (!item.children || item.children.length === 0) {
      return { output: [] };
    }
    
    const files = item.children.map(child => {
      const prefix = child.type === 'directory' ? 'd' : '-';
      const permissions = child.permissions.slice(1);
      const size = child.size.toString().padStart(8);
      const date = child.modified.toLocaleDateString();
      const name = child.type === 'directory' ? `\x1b[34m${child.name}\x1b[0m` : child.name;
      
      return `${prefix}${permissions} ${child.owner.padEnd(8)} ${size} ${date} ${name}`;
    });
    
    return { output: files };
  }
};

const cdCommand: Command = {
  name: 'cd',
  description: 'Change directory',
  usage: 'cd [directory]',
  execute: (args, system) => {
    const targetPath = args.length > 0 ? resolvePath(system.currentDirectory, args[0]) : '/home/user';
    const item = findItem(targetPath, system.fileSystem);
    
    if (!item) {
      return { output: [`cd: no such file or directory: ${targetPath}`] };
    }
    
    if (item.type !== 'directory') {
      return { output: [`cd: not a directory: ${targetPath}`] };
    }
    
    return {
      output: [],
      newState: { currentDirectory: targetPath }
    };
  }
};

const pwdCommand: Command = {
  name: 'pwd',
  description: 'Print working directory',
  usage: 'pwd',
  execute: (args, system) => {
    return { output: [system.currentDirectory] };
  }
};

const catCommand: Command = {
  name: 'cat',
  description: 'Display file contents',
  usage: 'cat <file>',
  execute: (args, system) => {
    if (args.length === 0) {
      return { output: ['cat: missing file operand'] };
    }
    
    const targetPath = resolvePath(system.currentDirectory, args[0]);
    const item = findItem(targetPath, system.fileSystem);
    
    if (!item) {
      return { output: [`cat: ${args[0]}: No such file or directory`] };
    }
    
    if (item.type === 'directory') {
      return { output: [`cat: ${args[0]}: Is a directory`] };
    }
    
    return { output: (item.content || '').split('\n') };
  }
};

const echoCommand: Command = {
  name: 'echo',
  description: 'Display text',
  usage: 'echo <text>',
  execute: (args) => {
    return { output: [args.join(' ')] };
  }
};

const clearCommand: Command = {
  name: 'clear',
  description: 'Clear terminal screen',
  usage: 'clear',
  execute: () => {
    return { output: ['\x1b[2J\x1b[H'] };
  }
};

const mkdirCommand: Command = {
  name: 'mkdir',
  description: 'Create directory',
  usage: 'mkdir <directory>',
  execute: (args, system) => {
    if (args.length === 0) {
      return { output: ['mkdir: missing operand'] };
    }
    
    const targetPath = resolvePath(system.currentDirectory, args[0]);
    const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
    const dirName = targetPath.substring(targetPath.lastIndexOf('/') + 1);
    
    const parent = findItem(parentPath, system.fileSystem);
    if (!parent || parent.type !== 'directory') {
      return { output: [`mkdir: cannot create directory '${args[0]}': No such file or directory`] };
    }
    
    if (parent.children?.find(child => child.name === dirName)) {
      return { output: [`mkdir: cannot create directory '${args[0]}': File exists`] };
    }
    
    const newDir = {
      name: dirName,
      type: 'directory' as const,
      permissions: 'drwxr-xr-x',
      owner: 'user',
      size: 4096,
      modified: new Date(),
      children: []
    };
    
    const newFileSystem = addItemToFileSystem(system.fileSystem, parentPath, newDir);
    
    return {
      output: [],
      newState: { fileSystem: newFileSystem }
    };
  }
};

const touchCommand: Command = {
  name: 'touch',
  description: 'Create empty file',
  usage: 'touch <file>',
  execute: (args, system) => {
    if (args.length === 0) {
      return { output: ['touch: missing file operand'] };
    }
    
    const targetPath = resolvePath(system.currentDirectory, args[0]);
    const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
    const fileName = targetPath.substring(targetPath.lastIndexOf('/') + 1);
    
    const parent = findItem(parentPath, system.fileSystem);
    if (!parent || parent.type !== 'directory') {
      return { output: [`touch: cannot touch '${args[0]}': No such file or directory`] };
    }
    
    if (parent.children?.find(child => child.name === fileName)) {
      return { output: [] }; // File exists, just update timestamp
    }
    
    const newFile = {
      name: fileName,
      type: 'file' as const,
      permissions: '-rw-r--r--',
      owner: 'user',
      size: 0,
      modified: new Date(),
      content: ''
    };
    
    const newFileSystem = addItemToFileSystem(system.fileSystem, parentPath, newFile);
    
    return {
      output: [],
      newState: { fileSystem: newFileSystem }
    };
  }
};

// Easter egg commands
const slCommand: Command = {
  name: 'sl',
  description: 'Steam locomotive',
  usage: 'sl',
  execute: () => {
    const train = [
      '                 (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O',
      '            (@@@)',
      '        (    )',
      '      (@@@@)',
      '   (   )',
      '',
      '🚂💨 CHOO CHOO! 🚂💨',
      '',
      'You have new mail.'
    ];
    return { output: train };
  }
};

const fortuneCommand: Command = {
  name: 'fortune',
  description: 'Display a random fortune',
  usage: 'fortune',
  execute: () => {
    const fortunes = [
      "In the 90s, we dreamed of the future. Now we dream of the 90s.",
      "Real programmers don't use IDEs. They use butterflies.",
      "There are only 10 types of people: those who understand binary and those who don't.",
      "404: Fortune not found. Have you tried turning it off and on again?",
      "The best code is no code at all.",
      "A computer without Windows is like a chocolate cake without mustard."
    ];
    
    return { output: [fortunes[Math.floor(Math.random() * fortunes.length)]] };
  }
};

const hackCommand: Command = {
  name: 'hack',
  description: 'Hack the planet!',
  usage: 'hack the planet',
  execute: (args) => {
    if (args.join(' ') !== 'the planet') {
      return { output: ['Usage: hack the planet'] };
    }
    
    const matrix = [
      '01001000 01100001 01100011 01101011 01101001 01101110 01100111',
      '11010100 10101010 11110000 01010101 11001100 10011001 01100110',
      '10101010 11111111 00000000 11110000 01010101 10101010 11001100',
      '',
      '\x1b[32mACCESS GRANTED\x1b[0m',
      '\x1b[32mWELCOME TO THE MATRIX\x1b[0m',
      '',
      'Just kidding! You\'re still in Ubuntu90s 😄'
    ];
    
    return { output: matrix };
  }
};

const sudoCommand: Command = {
  name: 'sudo',
  description: 'Execute commands as another user',
  usage: 'sudo <command>',
  execute: (args) => {
    if (args.length === 0) {
      return { output: ['sudo: a command must be specified'] };
    }
    
    if (args[0] === 'apt' && args[1] === 'install' && args[2] === 'cowsay') {
      return { output: ['Haha, very funny! 🐄 This is a retro simulator, not a real system!'] };
    }
    
    if (args.join(' ') === 'rm -rf /') {
      return {
        output: [
          '\x1b[31mWARNING: This would destroy the entire system!\x1b[0m',
          'Just kidding... this is a simulator! 😅',
          'Nothing was actually deleted.'
        ]
      };
    }
    
    return { output: [`sudo: ${args[0]}: command not found`] };
  }
};

export const commands: Command[] = [
  helpCommand,
  lsCommand,
  cdCommand,
  pwdCommand,
  catCommand,
  echoCommand,
  clearCommand,
  mkdirCommand,
  touchCommand,
  slCommand,
  fortuneCommand,
  hackCommand,
  sudoCommand
];