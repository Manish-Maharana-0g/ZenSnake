
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
    targetLength: 15,
    speed: 1.0,
    obstacles: [],
    description: "A simple start. Just grow to length 15."
  },
  {
    id: 2,
    name: "The Pillars",
    targetLength: 20,
    speed: 1.1,
    obstacles: [
      { x: 4, y: 6 }, { x: 10, y: 6 },
      { x: 4, y: 16 }, { x: 10, y: 16 }
    ],
    description: "Watch out for the ancient pillars!"
  },
  {
    id: 3,
    name: "Zig Zag",
    targetLength: 25,
    speed: 1.2,
    obstacles: [
      { x: 8, y: 8 }, { x: 8, y: 9 }, { x: 8, y: 10 },
      { x: 2, y: 15 }, { x: 3, y: 15 }, { x: 4, y: 15 },
      { x: 12, y: 20 }, { x: 13, y: 20 }, { x: 14, y: 20 }
    ],
    description: "Tight corners ahead."
  },
  {
    id: 4,
    name: "The Corridor",
    targetLength: 30,
    speed: 1.3,
    obstacles: [
      { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 },
      { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 }, { x: 10, y: 15 }, { x: 10, y: 16 }
    ],
    description: "Navigate the narrow pathways."
  },
  {
    id: 5,
    name: "The Cross",
    targetLength: 35,
    speed: 1.4,
    obstacles: [
      { x: 7, y: 10 }, { x: 7, y: 11 }, { x: 7, y: 12 }, { x: 7, y: 13 }, { x: 7, y: 14 },
      { x: 5, y: 12 }, { x: 6, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 }
    ],
    description: "A central blockade. Stay focused."
  },
  {
    id: 6,
    name: "Gauntlet",
    targetLength: 40,
    speed: 1.6,
    obstacles: [
      { x: 2, y: 6 }, { x: 2, y: 7 },
      { x: 12, y: 6 }, { x: 12, y: 7 },
      { x: 2, y: 20 }, { x: 2, y: 21 },
      { x: 12, y: 20 }, { x: 12, y: 21 },
      { x: 7, y: 13 }, { x: 7, y: 14 }
    ],
    description: "High speed, high stakes."
  },
  {
    id: 7,
    name: "Zen Master",
    targetLength: 50,
    speed: 1.8,
    obstacles: [
      { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 },
      { x: 11, y: 10 }, { x: 12, y: 10 }, { x: 13, y: 10 },
      { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
      { x: 7, y: 18 }, { x: 7, y: 19 }, { x: 7, y: 20 }
    ],
    description: "The ultimate test of precision."
  }
];
