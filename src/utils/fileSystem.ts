import { FileSystemItem } from '../types';

export const createInitialFileSystem = (): FileSystemItem => ({
  name: '/',
  type: 'directory',
  permissions: 'drwxr-xr-x',
  owner: 'root',
  size: 4096,
  modified: new Date(),
  children: [
    {
      name: 'home',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      size: 4096,
      modified: new Date(),
      children: [
        {
          name: 'user',
          type: 'directory',
          permissions: 'drwxr-xr-x',
          owner: 'user',
          size: 4096,
          modified: new Date(),
          children: [
            {
              name: 'welcome.txt',
              type: 'file',
              permissions: '-rw-r--r--',
              owner: 'user',
              size: 156,
              modified: new Date(),
              content: 'Welcome to Ubuntu90s!\n\nThis is a retro terminal simulator.\nTry commands like: ls, cd, help, sl\n\nHave fun exploring!'
            },
            {
              name: 'doom.sim',
              type: 'file',
              permissions: '-rwxr-xr-x',
              owner: 'user',
              size: 2048,
              modified: new Date(),
              content: '#!/bin/bash\necho "Starting DOOM..."'
            },
            {
              name: 'netscape.sim',
              type: 'file',
              permissions: '-rwxr-xr-x',
              owner: 'user',
              size: 1536,
              modified: new Date(),
              content: '#!/bin/bash\necho "Starting Netscape Navigator..."'
            }
          ]
        }
      ]
    },
    {
      name: 'usr',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      size: 4096,
      modified: new Date(),
      children: []
    },
    {
      name: 'var',
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      size: 4096,
      modified: new Date(),
      children: []
    }
  ]
});

export const findItem = (path: string, fileSystem: FileSystemItem): FileSystemItem | null => {
  if (path === '/') return fileSystem;
  
  const parts = path.split('/').filter(p => p !== '');
  let current = fileSystem;
  
  for (const part of parts) {
    if (!current.children) return null;
    const found = current.children.find(child => child.name === part);
    if (!found) return null;
    current = found;
  }
  
  return current;
};

export const resolvePath = (currentPath: string, targetPath: string): string => {
  if (targetPath.startsWith('/')) {
    return targetPath;
  }
  
  if (targetPath === '.') {
    return currentPath;
  }
  
  if (targetPath === '..') {
    const parts = currentPath.split('/').filter(p => p !== '');
    parts.pop();
    return '/' + parts.join('/');
  }
  
  if (currentPath === '/') {
    return '/' + targetPath;
  }
  
  return currentPath + '/' + targetPath;
};

export const addItemToFileSystem = (
  fileSystem: FileSystemItem,
  path: string,
  item: FileSystemItem
): FileSystemItem => {
  const pathParts = path.split('/').filter(p => p !== '');
  let current = { ...fileSystem };
  
  if (pathParts.length === 0) {
    if (!current.children) current.children = [];
    current.children = [...current.children, item];
    return current;
  }
  
  const traverse = (node: FileSystemItem, parts: string[]): FileSystemItem => {
    if (parts.length === 0) {
      if (!node.children) node.children = [];
      node.children = [...node.children, item];
      return node;
    }
    
    const [head, ...tail] = parts;
    const childIndex = node.children?.findIndex(child => child.name === head) ?? -1;
    
    if (childIndex !== -1 && node.children) {
      node.children[childIndex] = traverse(node.children[childIndex], tail);
    }
    
    return node;
  };
  
  return traverse(current, pathParts);
};