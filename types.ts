
export enum GameMode {
  MENU = 'MENU',
  CLASSIC = 'CLASSIC',
  ADVENTURE = 'ADVENTURE',
  SETTINGS = 'SETTINGS',
  LEVEL_SELECT = 'LEVEL_SELECT'
}

export enum GameState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAMEOVER = 'GAMEOVER',
  LEVEL_WON = 'LEVEL_WON'
}

export interface Point {
  x: number;
  y: number;
}

export interface Food extends Point {
  type: 'NORMAL' | 'BOOST' | 'SHRINK';
  color: string;
}

export interface SnakeSegment extends Point {
  angle: number;
}

export interface Level {
  id: number;
  name: string;
  targetLength: number;
  speed: number;
  obstacles: Point[];
  description: string;
}

export interface Settings {
  haptics: boolean;
  sound: boolean;
  music: boolean;
  accentColor: string;
  loopingBorders: boolean;
}

export interface HighScore {
  classicWalled: number;
  classicLooping: number;
  levelsCompleted: number[];
}
