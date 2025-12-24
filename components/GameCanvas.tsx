
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, Point, GameMode, Level, Settings } from '../types';
import { COLORS, GRID_SIZE, TICK_RATE_BASE } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  gameMode: GameMode;
  currentLevel?: Level;
  onGameOver: (score: number) => void;
  onWin: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  settings: Settings;
  onEat: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  gameState, 
  gameMode, 
  currentLevel, 
  onGameOver, 
  onWin,
  onScoreUpdate,
  settings,
  onEat
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  
  // Snake state in grid coordinates
  const snakeRef = useRef<Point[]>([]);
  const foodRef = useRef<Point | null>(null);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const lastTickTimeRef = useRef<number>(0);
  const frameId = useRef<number>(0);
  
  // Swipe detection refs
  const touchStartRef = useRef<Point | null>(null);

  const spawnFood = useCallback(() => {
    const cols = Math.floor(window.innerWidth / GRID_SIZE);
    const rows = Math.floor(window.innerHeight / GRID_SIZE);
    
    let newFood: Point;
    let collision: boolean;
    
    do {
      collision = false;
      newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      };
      
      // Ensure food doesn't spawn on UI areas (top 4 rows roughly)
      if (newFood.y < 4) {
        collision = true;
        continue;
      }

      for (const seg of snakeRef.current) {
        if (seg.x === newFood.x && seg.y === newFood.y) {
          collision = true;
          break;
        }
      }
      
      if (currentLevel?.obstacles) {
        for (const obs of currentLevel.obstacles) {
          if (obs.x === newFood.x && obs.y === newFood.y) {
            collision = true;
            break;
          }
        }
      }
    } while (collision);
    
    foodRef.current = newFood;
  }, [currentLevel]);

  const initGame = useCallback(() => {
    const width = Math.floor(window.innerWidth / GRID_SIZE);
    const height = Math.floor(window.innerHeight / GRID_SIZE);
    
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height / 2);

    snakeRef.current = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    lastTickTimeRef.current = 0;
    spawnFood();
    setScore(0);
    onScoreUpdate(0);
  }, [spawnFood, onScoreUpdate]);

  // Handle Input logic
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      const dx = touchEnd.x - touchStartRef.current.x;
      const dy = touchEnd.y - touchStartRef.current.y;
      
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

      const current = directionRef.current;
      let newDir = { ...current };

      if (Math.abs(dx) > Math.abs(dy)) {
        newDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      } else {
        newDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }

      if (current.x !== 0 && newDir.y !== 0) {
        nextDirectionRef.current = newDir;
      } else if (current.y !== 0 && newDir.x !== 0) {
        nextDirectionRef.current = newDir;
      }

      touchStartRef.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const current = directionRef.current;
      let newDir = { ...current };

      if (e.key === 'ArrowUp') newDir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown') newDir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft') newDir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight') newDir = { x: 1, y: 0 };

      if (current.x !== 0 && newDir.y !== 0) nextDirectionRef.current = newDir;
      else if (current.y !== 0 && newDir.x !== 0) nextDirectionRef.current = newDir;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += GRID_SIZE) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    const accentColor = settings.accentColor || COLORS.SNAKE_HEAD;

    if (currentLevel?.obstacles) {
      ctx.fillStyle = COLORS.OBSTACLE;
      for (const obs of currentLevel.obstacles) {
        ctx.beginPath();
        ctx.roundRect(obs.x * GRID_SIZE + 2, obs.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (foodRef.current) {
      ctx.fillStyle = COLORS.FOOD;
      ctx.shadowBlur = 15;
      ctx.shadowColor = COLORS.FOOD;
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * GRID_SIZE + GRID_SIZE / 2,
        foodRef.current.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 4,
        0, Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Body
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.7;
    for (let i = 1; i < snakeRef.current.length; i++) {
      const seg = snakeRef.current[i];
      ctx.beginPath();
      const padding = 2;
      ctx.roundRect(
        seg.x * GRID_SIZE + padding,
        seg.y * GRID_SIZE + padding,
        GRID_SIZE - padding * 2,
        GRID_SIZE - padding * 2,
        6
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Head
    const head = snakeRef.current[0];
    if (head) {
      ctx.save();
      ctx.translate(head.x * GRID_SIZE + GRID_SIZE / 2, head.y * GRID_SIZE + GRID_SIZE / 2);
      const currentDir = directionRef.current;
      const headAngle = Math.atan2(currentDir.y, currentDir.x);
      ctx.rotate(headAngle);
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(-GRID_SIZE / 2 + 1, -GRID_SIZE / 2 + 1, GRID_SIZE - 2, GRID_SIZE - 2, 8);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(GRID_SIZE/4, -GRID_SIZE/4, 3.5, 0, Math.PI * 2);
      ctx.arc(GRID_SIZE/4, GRID_SIZE/4, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(GRID_SIZE/4 + 1.2, -GRID_SIZE/4, 1.8, 0, Math.PI * 2);
      ctx.arc(GRID_SIZE/4 + 1.2, GRID_SIZE/4, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, [currentLevel, settings.accentColor]);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== GameState.PLAYING) {
      draw();
      frameId.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (lastTickTimeRef.current === 0) lastTickTimeRef.current = timestamp;

    const levelSpeed = currentLevel?.speed || 1.0;
    const tickInterval = TICK_RATE_BASE / levelSpeed;

    if (timestamp - lastTickTimeRef.current > tickInterval) {
      lastTickTimeRef.current = timestamp;
      
      directionRef.current = nextDirectionRef.current;
      
      const cols = Math.floor(window.innerWidth / GRID_SIZE);
      const rows = Math.floor(window.innerHeight / GRID_SIZE);

      const head = { ...snakeRef.current[0] };
      const isLooping = gameMode === GameMode.CLASSIC && settings.loopingBorders;

      let nextX = head.x + directionRef.current.x;
      let nextY = head.y + directionRef.current.y;

      if (isLooping) {
        nextX = (nextX + cols) % cols;
        nextY = (nextY + rows) % rows;
      } else {
        // Walled logic (Classic Walled or Adventure)
        if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= rows) {
          onGameOver(snakeRef.current.length - 3);
          return;
        }
      }

      const nextHead = { x: nextX, y: nextY };

      // Check self-collision
      for (const seg of snakeRef.current) {
        if (nextHead.x === seg.x && nextHead.y === seg.y) {
          onGameOver(snakeRef.current.length - 3);
          return;
        }
      }

      // Check obstacle collision
      if (currentLevel?.obstacles) {
        for (const obs of currentLevel.obstacles) {
          if (nextHead.x === obs.x && nextHead.y === obs.y) {
            onGameOver(snakeRef.current.length - 3);
            return;
          }
        }
      }

      const newSnake = [nextHead, ...snakeRef.current];

      if (foodRef.current && nextHead.x === foodRef.current.x && nextHead.y === foodRef.current.y) {
        onEat();
        const newScore = snakeRef.current.length - 3 + 1;
        setScore(newScore);
        onScoreUpdate(newScore);
        spawnFood();
        
        if (gameMode === GameMode.ADVENTURE && currentLevel && (newSnake.length - 3) >= currentLevel.targetLength) {
          onWin(newSnake.length - 3);
          return;
        }
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    }

    draw();
    frameId.current = requestAnimationFrame(gameLoop);
  }, [gameState, currentLevel, gameMode, onGameOver, onWin, onEat, spawnFood, draw, onScoreUpdate, settings.loopingBorders]);

  // Handle initialization ONLY once on mount. 
  useEffect(() => {
    initGame();
  }, []); 

  // Handle Canvas Resizing and Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    frameId.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameId.current);
  }, [gameLoop]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="bg-[#1C1B1F]" />
      <div className="absolute top-6 left-6 text-white font-bold text-2xl flex items-center gap-2 pointer-events-none">
        <span 
          className="px-4 py-2 rounded-full border flex items-center gap-2"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <i className="fas fa-apple-whole text-red-400"></i>
          {score}
        </span>
        
        {gameMode === GameMode.CLASSIC && (
          <span 
            className="px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-[0.1em] text-white/50"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {settings.loopingBorders ? 'Looping' : 'Walled'}
          </span>
        )}

        {gameMode === GameMode.ADVENTURE && currentLevel && (
           <span 
            className="px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-[0.1em] text-white/50"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
           >
             Target: {currentLevel.targetLength}
           </span>
        )}
      </div>
    </div>
  );
};

export default GameCanvas;
