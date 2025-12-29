
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
      { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 8 }, { x: 6, y: 8 },
      { x: 15, y: 7 }, { x: 16, y: 7 }, { x: 15, y: 8 }, { x: 16, y: 8 },
      { x: 5, y: 17 }, { x: 6, y: 17 }, { x: 5, y: 18 }, { x: 6, y: 18 },
      { x: 15, y: 17 }, { x: 16, y: 17 }, { x: 15, y: 18 }, { x: 16, y: 18 },
      { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 13 }, { x: 11, y: 13 }
    ],
    description: "The stone structures grow in number."
  },
  {
    id: 3,
    name: "The Divide",
    targetLength: 27,
    speed: 1.2,
    obstacles: [
      { x: 2, y: 12 }, { x: 3, y: 12 }, { x: 4, y: 12 }, { x: 5, y: 12 }, { x: 6, y: 12 },
      { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 12, y: 12 }, { x: 13, y: 12 }, { x: 14, y: 12 },
      { x: 15, y: 12 }, { x: 16, y: 12 }, { x: 17, y: 12 }, { x: 18, y: 12 },
      { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }
    ],
    description: "Horizontal and vertical barriers test your focus."
  },
  {
    id: 4,
    name: "Serpent Gate",
    targetLength: 29,
    speed: 1.3,
    obstacles: [
      { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 4 },
      { x: 16, y: 4 }, { x: 16, y: 5 }, { x: 16, y: 6 }, { x: 15, y: 4 }, { x: 14, y: 4 },
      { x: 4, y: 20 }, { x: 4, y: 21 }, { x: 4, y: 22 }, { x: 5, y: 22 }, { x: 6, y: 22 },
      { x: 16, y: 20 }, { x: 16, y: 21 }, { x: 16, y: 22 }, { x: 15, y: 22 }, { x: 14, y: 22 },
      { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 10 }, { x: 11, y: 11 },
      { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 11, y: 14 }, { x: 11, y: 15 }
    ],
    description: "A series of gates tighten the arena."
  },
  {
    id: 5,
    name: "Corridors",
    targetLength: 31,
    speed: 1.4,
    obstacles: [
      { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 },
      { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 }, { x: 5, y: 17 }, { x: 5, y: 18 }, { x: 5, y: 19 }, { x: 5, y: 20 },
      { x: 15, y: 4 }, { x: 15, y: 5 }, { x: 15, y: 6 }, { x: 15, y: 7 }, { x: 15, y: 8 }, { x: 15, y: 9 }, { x: 15, y: 10 },
      { x: 15, y: 14 }, { x: 15, y: 15 }, { x: 15, y: 16 }, { x: 15, y: 17 }, { x: 15, y: 18 }, { x: 15, y: 19 }, { x: 15, y: 20 },
      { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 9, y: 12 }
    ],
    description: "Long parallel walls force linear movement."
  },
  {
    id: 6,
    name: "The Web",
    targetLength: 33,
    speed: 1.6,
    obstacles: [
      { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 },
      { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 }, { x: 8, y: 7 },
      { x: 12, y: 8 }, { x: 13, y: 8 }, { x: 14, y: 8 }, { x: 15, y: 8 }, { x: 16, y: 8 },
      { x: 12, y: 4 }, { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 },
      { x: 4, y: 16 }, { x: 5, y: 16 }, { x: 6, y: 16 }, { x: 7, y: 16 }, { x: 8, y: 16 },
      { x: 8, y: 17 }, { x: 8, y: 18 }, { x: 8, y: 19 }, { x: 8, y: 20 },
      { x: 12, y: 16 }, { x: 13, y: 16 }, { x: 14, y: 16 }, { x: 15, y: 16 }, { x: 16, y: 16 },
      { x: 12, y: 17 }, { x: 12, y: 18 }, { x: 12, y: 19 }, { x: 12, y: 20 }
    ],
    description: "Intricate L-shapes create dangerous pockets."
  },
  {
    id: 7,
    name: "Zen Master",
    targetLength: 35,
    speed: 1.8,
    obstacles: [
      { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 },
      { x: 10, y: 16 }, { x: 10, y: 17 }, { x: 10, y: 18 }, { x: 10, y: 19 }, { x: 10, y: 20 },
      { x: 4, y: 12 }, { x: 5, y: 12 }, { x: 6, y: 12 }, { x: 7, y: 12 }, { x: 8, y: 12 },
      { x: 12, y: 12 }, { x: 13, y: 12 }, { x: 14, y: 12 }, { x: 15, y: 12 }, { x: 16, y: 12 },
      { x: 4, y: 4 }, { x: 16, y: 4 }, { x: 4, y: 20 }, { x: 16, y: 20 },
      { x: 3, y: 3 }, { x: 17, y: 3 }, { x: 3, y: 21 }, { x: 17, y: 21 }
    ],
    description: "The cross of trials. Reach 35 to master the game."
  }
];