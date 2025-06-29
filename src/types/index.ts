export interface DOSFile {
  name: string;
  extension: string;
  type: 'file' | 'directory';
  content?: string;
  size: number;
  date: string;
  time: string;
  attributes: string;
  children?: DOSFile[];
}

export interface DOSState {
  currentDrive: string;
  currentPath: string;
  fileSystem: { [drive: string]: DOSFile };
  screenBuffer: string[];
  cursorPosition: { x: number; y: number };
  currentProgram: string | null;
  gameState?: any;
}

export interface DOSCommand {
  name: string;
  description: string;
  execute: (args: string[], state: DOSState) => {
    output?: string[];
    newState?: Partial<DOSState>;
    clearScreen?: boolean;
    program?: string;
  };
}

export interface DoomGameState {
  level: number;
  health: number;
  ammo: number;
  score: number;
  playerX: number;
  playerY: number;
  enemies: Array<{ x: number; y: number; health: number; type: string }>;
  map: string[][];
  gameRunning: boolean;
}