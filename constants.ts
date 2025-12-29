
import { Level } from './types';

export const COLORS = {
  SNAKE_HEAD: 'var(--m3-accent)',
  SNAKE_BODY: '#9A82DB',
  FOOD: '#FFB4AB',
  OBSTACLE: '#633B48',
  BACKGROUND: '#1C1B1F',
  GRID: '#2B2930',
};

export const ACCENT_PALETTE = [
  { name: 'Lavender', value: '#D0BCFF' },
  { name: 'Mint', value: '#A8E6CF' },
  { name: 'Peach', value: '#FFD3B6' },
  { name: 'Sky', value: '#81D4FA' },
  { name: 'Gold', value: '#FFF176' },
];

// Grid and Movement Constants
export const GRID_SIZE = 24; 
export const TICK_RATE_BASE = 150; // ms between moves (lower is faster)

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Grasslands",
    targetLength: 23,
    speed: 1.0,
    obstacles: [],
    description: "The journey begins. Just grow to length 23."
  },
  {
    id: 2,
    name: "The Pillars",
    targetLength: 25,
    speed: 1.1,
    obstacles: [
      { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 8 }, { x: 4, y: 8 },
      { x: 11, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 8 }, { x: 12, y: 8 },
      { x: 3, y: 17 }, { x: 4, y: 17 }, { x: 3, y: 18 }, { x: 4, y: 18 },
      { x: 11, y: 17 }, { x: 12, y: 17 }, { x: 11, y: 18 }, { x: 12, y: 18 }
    ],
    description: "Navigate through the stone foundations."
  },
  {
    id: 3,
    name: "Divided",
    targetLength: 27,
    speed: 1.2,
    obstacles: [
      { x: 2, y: 12 }, { x: 3, y: 12 }, { x: 4, y: 12 }, { x: 5, y: 12 }, { x: 6, y: 12 },
      { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 12, y: 12 }, { x: 13, y: 12 }, { x: 14, y: 12 },
      { x: 2, y: 13 }, { x: 14, y: 13 }, { x: 2, y: 14 }, { x: 14, y: 14 }
    ],
    description: "A horizontal divide test your precision."
  },
  {
    id: 4,
    name: "Snake Pit",
    targetLength: 29,
    speed: 1.3,
    obstacles: [
      { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 },
      { x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 6, y: 13 }, { x: 7, y: 13 },
      { x: 7, y: 16 }, { x: 7, y: 17 }, { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 },
      { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }
    ],
    description: "A cross-shaped blockade splits the arena."
  },
  {
    id: 5,
    name: "Corridors",
    targetLength: 31,
    speed: 1.4,
    obstacles: [
      { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 },
      { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 10, y: 20 },
      { x: 3, y: 23 }, { x: 4, y: 23 }, { x: 5, y: 23 }, { x: 10, y: 23 }, { x: 11, y: 23 }, { x: 12, y: 23 }
    ],
    description: "Narrow lanes require careful slithering."
  },
  {
    id: 6,
    name: "Maze Walk",
    targetLength: 33,
    speed: 1.6,
    obstacles: [
      { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 },
      { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 },
      { x: 10, y: 15 }, { x: 11, y: 15 }, { x: 12, y: 15 }, { x: 13, y: 15 },
      { x: 10, y: 14 }, { x: 10, y: 13 }, { x: 10, y: 12 }, { x: 10, y: 11 },
      { x: 4, y: 20 }, { x: 5, y: 20 }, { x: 6, y: 20 }, { x: 7, y: 20 }, { x: 8, y: 20 }
    ],
    description: "Intricate maze sections increase the difficulty."
  },
  {
    id: 7,
    name: "Zen Master",
    targetLength: 35,
    speed: 1.8,
    obstacles: [
      { x: 1, y: 15 }, { x: 2, y: 15 }, { x: 3, y: 15 }, { x: 4, y: 15 },
      { x: 11, y: 15 }, { x: 12, y: 15 }, { x: 13, y: 15 }, { x: 14, y: 15 },
      { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 },
      { x: 7, y: 22 }, { x: 7, y: 23 }, { x: 7, y: 24 }, { x: 7, y: 25 },
      { x: 4, y: 10 }, { x: 10, y: 10 }, { x: 4, y: 20 }, { x: 10, y: 20 }
    ],
    description: "The ultimate trial. Reach 35 to master the game."
  }
];