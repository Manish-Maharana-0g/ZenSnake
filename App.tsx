import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, GameState, HighScore, Settings, Level } from './types';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { LEVELS, ACCENT_PALETTE } from './constants';
import GameCanvas from './components/GameCanvas';
import BackgroundSnake from './components/BackgroundSnake';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '208, 188, 255';
};

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const [state, setState] = useState<GameState>(GameState.PLAYING);
  const [highScore, setHighScore] = useState<HighScore>(storageService.getHighScore());
  const [settings, setSettings] = useState<Settings>(storageService.getSettings());
  const [currentLevel, setCurrentLevel] = useState<Level | undefined>(undefined);
  const [gameId, setGameId] = useState(0);
  
  const musicStartTimeoutRef = useRef<number | null>(null);

  // Apply accent color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--m3-accent', settings.accentColor);
    document.documentElement.style.setProperty('--m3-accent-rgb', hexToRgb(settings.accentColor));
    const isLight = settings.accentColor === '#FFF176' || settings.accentColor === '#FFD3B6';
    document.documentElement.style.setProperty('--m3-on-accent', isLight ? '#454000' : '#381e72');
  }, [settings.accentColor]);

  useEffect(() => {
    audioService.init();
    audioService.setEnabled(settings.sound);
    audioService.setMusicEnabled(settings.music);
  }, [settings.sound, settings.music]);

  useEffect(() => {
    if (mode === GameMode.MENU || mode === GameMode.SETTINGS || mode === GameMode.LEVEL_SELECT) {
      if (musicStartTimeoutRef.current) {
        window.clearTimeout(musicStartTimeoutRef.current);
        musicStartTimeoutRef.current = null;
      }
      audioService.stopMusic();
      audioService.setDefeatMode(false);
    }
  }, [mode]);

  const startGame = (gameMode: GameMode, level?: Level) => {
    audioService.init(); 
    setGameId(prev => prev + 1); 
    setMode(gameMode);
    setCurrentLevel(level);
    setState(GameState.PLAYING);
    audioService.playClick();
    audioService.setDefeatMode(false);
    
    if (musicStartTimeoutRef.current) window.clearTimeout(musicStartTimeoutRef.current);
    
    musicStartTimeoutRef.current = window.setTimeout(() => {
      audioService.startMusic(true); 
      musicStartTimeoutRef.current = null;
    }, 750);
  };

  const updateHighScoreIfNeeded = useCallback((score: number) => {
    if (mode === GameMode.CLASSIC) {
      const isLooping = settings.loopingBorders;
      setHighScore(prev => {
        const scoreKey = isLooping ? 'classicLooping' : 'classicWalled';
        if (score > prev[scoreKey]) {
          const newScore = { ...prev, [scoreKey]: score };
          storageService.saveHighScore(newScore);
          return newScore;
        }
        return prev;
      });
    }
  }, [mode, settings.loopingBorders]);

  const handleGameOver = useCallback((finalScore: number) => {
    setState(GameState.GAMEOVER);
    audioService.playDie();
    audioService.setDefeatMode(true);
    updateHighScoreIfNeeded(finalScore);
    if (settings.haptics) window.navigator.vibrate([100, 50, 100]);
  }, [updateHighScoreIfNeeded, settings.haptics]);

  const handleWin = useCallback((finalScore: number) => {
    setState(GameState.LEVEL_WON);
    audioService.playWin();
    audioService.stopMusic();
    if (settings.haptics) window.navigator.vibrate(200);

    if (currentLevel) {
      setHighScore(prev => {
        if (!prev.levelsCompleted.includes(currentLevel.id)) {
          const newScore = { 
            ...prev, 
            levelsCompleted: [...prev.levelsCompleted, currentLevel.id] 
          };
          storageService.saveHighScore(newScore);
          return newScore;
        }
        return prev;
      });
    }
  }, [currentLevel, settings.haptics]);

  const handleEat = useCallback(() => {
    audioService.playEat();
    if (settings.haptics) window.navigator.vibrate(15);
  }, [settings.haptics]);

  const toggleSettings = (key: keyof Settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    audioService.playClick();
  };

  const setAccent = (color: string) => {
    const newSettings = { ...settings, accentColor: color };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
    audioService.playClick();
  };

  const renderMenu = () => {
    const currentBest = settings.loopingBorders ? highScore.classicLooping : highScore.classicWalled;
    return (
      <div className="relative flex flex-col items-center justify-center h-full p-6 space-y-8">
        <BackgroundSnake />
        
        <div className="z-10 text-center animate-in fade-in zoom-in duration-700">
          <h1 className="text-7xl font-bold tracking-tighter text-white drop-shadow-2xl animate-float">ZEN SNAKE</h1>
          <p className="text-[var(--m3-accent)] mt-2 font-medium tracking-widest uppercase opacity-80">Classic Relaxation</p>
        </div>
        
        <div className="z-10 w-full max-w-sm m3-card p-8 flex flex-col space-y-4 animate-in slide-in-from-bottom-10 duration-500">
          <button 
            onClick={() => startGame(GameMode.CLASSIC)}
            className="m3-button-primary text-xl py-4 flex items-center justify-center gap-3"
          >
            <i className="fas fa-play"></i> Classic Mode
          </button>
          <button 
            onClick={() => { audioService.playClick(); setMode(GameMode.LEVEL_SELECT); }}
            className="m3-button-tonal-accented py-4 flex items-center justify-center gap-3"
          >
            <i className="fas fa-map"></i> Adventure Mode
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => { audioService.playClick(); setMode(GameMode.SETTINGS); }}
              className="flex-1 m3-button-tonal py-3"
            >
              <i className="fas fa-cog mr-2"></i> Settings
            </button>
          </div>
        </div>

        <div className="z-10 flex flex-col items-center gap-1">
          <div className="text-center text-sm text-white/30 uppercase tracking-widest">
            Best {settings.loopingBorders ? 'Looping' : 'Walled'}: <span className="text-white/60 font-medium">{currentBest}</span>
          </div>
          <button 
            onClick={() => toggleSettings('loopingBorders')}
            className="text-[10px] text-[var(--m3-accent)]/40 hover:text-[var(--m3-accent)]/80 uppercase tracking-[0.2em] px-4 py-1 rounded-full border border-[var(--m3-accent)]/10"
          >
            Switch to {settings.loopingBorders ? 'Walled' : 'Looping'}
          </button>
        </div>
      </div>
    );
  };

  const renderLevelSelect = () => (
    <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => { audioService.playClick(); setMode(GameMode.MENU); }} className="text-2xl p-2"><i className="fas fa-arrow-left"></i></button>
        <h2 className="text-3xl font-bold">Select Level</h2>
      </header>
      <div className="grid gap-4 overflow-y-auto pb-10">
        {LEVELS.map((level) => {
          const isCompleted = highScore.levelsCompleted.includes(level.id);
          const isUnlocked = level.id === 1 || highScore.levelsCompleted.includes(level.id - 1);
          
          return (
            <div 
              key={level.id}
              onClick={() => isUnlocked && startGame(GameMode.ADVENTURE, level)}
              className={`m3-card p-6 flex items-center justify-between border-2 transition-all ${
                isUnlocked ? 'active:scale-95' : 'opacity-50 grayscale'
              }`}
              style={{ borderColor: isUnlocked ? `rgba(var(--m3-accent-rgb), 0.2)` : 'rgba(255,255,255,0.05)' }}
            >
              <div>
                <h3 className="text-xl font-bold">{level.name}</h3>
                <p className="text-sm text-white/50">{level.description}</p>
              </div>
              <div className="flex items-center gap-3">
                {isCompleted && <i className="fas fa-check-circle text-emerald-400 text-2xl"></i>}
                {!isUnlocked && <i className="fas fa-lock text-white/30 text-2xl"></i>}
                {isUnlocked && !isCompleted && <i className="fas fa-chevron-right text-[var(--m3-accent)]"></i>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex flex-col h-full p-6 animate-in slide-in-from-left duration-300">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => { audioService.playClick(); setMode(GameMode.MENU); }} className="text-2xl p-2"><i className="fas fa-arrow-left"></i></button>
        <h2 className="text-3xl font-bold">Settings</h2>
      </header>
      
      <div className="space-y-6 overflow-y-auto pb-8">
        <section className="m3-card p-6 border border-white/5">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-4">Appearance</h3>
          <div className="flex justify-between items-center gap-2">
            {ACCENT_PALETTE.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccent(color.value)}
                className={`w-12 h-12 rounded-full border-4 transition-all ${settings.accentColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest px-2">Game Mechanics</h3>
          <div className="flex items-center justify-between p-4 m3-card border border-white/5">
            <div className="flex items-center gap-4">
              <i className={`fas fa-arrows-spin text-xl text-[var(--m3-accent)] w-8 text-center`}></i>
              <div>
                <span className="text-lg block">Looping Borders</span>
                <span className="text-xs text-white/40">Classic mode only</span>
              </div>
            </div>
            <button 
              onClick={() => toggleSettings('loopingBorders')}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.loopingBorders ? 'bg-[var(--m3-accent)]' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings.loopingBorders ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-widest px-2">General</h3>
          {[
            { key: 'haptics', label: 'Haptic Feedback', icon: 'fa-fingerprint' },
            { key: 'sound', label: 'Sound Effects', icon: 'fa-volume-high' },
            { key: 'music', label: 'Background Music', icon: 'fa-music' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 m3-card border border-white/5">
              <div className="flex items-center gap-4">
                <i className={`fas ${item.icon} text-xl text-[var(--m3-accent)] w-8 text-center`}></i>
                <span className="text-lg">{item.label}</span>
              </div>
              <button 
                onClick={() => toggleSettings(item.key as keyof Settings)}
                className={`w-14 h-8 rounded-full transition-colors relative ${settings[item.key as keyof Settings] ? 'bg-[var(--m3-accent)]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings[item.key as keyof Settings] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </section>
      </div>
      
      <div className="mt-auto p-4 text-center text-white/20 text-xs uppercase tracking-widest">
        Zen Snake v1.2.0 (Dual-Mode)
      </div>
    </div>
  );

  const renderGameOverlay = () => {
    if (state === GameState.PAUSED) {
      return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in duration-200">
          <h2 className="text-5xl font-bold mb-8">PAUSED</h2>
          <button 
            onClick={() => { 
              setState(GameState.PLAYING); 
              audioService.playClick(); 
              setTimeout(() => audioService.startMusic(false), 300);
            }}
            className="m3-button-primary text-xl px-12 mb-4"
          >
            RESUME
          </button>
          <button 
            onClick={() => { audioService.playClick(); setMode(GameMode.MENU); audioService.stopMusic(); }}
            className="m3-button-tonal bg-red-500/20 text-red-200 border border-red-500/30"
          >
            QUIT GAME
          </button>
        </div>
      );
    }

    if (state === GameState.GAMEOVER) {
      return (
        <div className="absolute inset-0 bg-red-950/40 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in zoom-in duration-300">
          <div className="text-6xl mb-4"><i className="fas fa-skull text-red-400"></i></div>
          <h2 className="text-5xl font-bold mb-2 text-red-200">GAME OVER</h2>
          <p className="text-red-200/60 mb-8">You hit something!</p>
          <div className="flex gap-4">
            <button 
              onClick={() => startGame(mode, currentLevel)}
              className="m3-button-primary px-10"
            >
              RETRY
            </button>
            <button 
              onClick={() => { audioService.playClick(); setMode(GameMode.MENU); }}
              className="m3-button-tonal px-10"
            >
              MENU
            </button>
          </div>
        </div>
      );
    }

    if (state === GameState.LEVEL_WON) {
      return (
        <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in zoom-in duration-300">
          <div className="text-6xl mb-4"><i className="fas fa-crown text-yellow-400"></i></div>
          <h2 className="text-5xl font-bold mb-2 text-emerald-100">VICTORY</h2>
          <p className="text-emerald-100/60 mb-8">{currentLevel?.name} Completed!</p>
          <div className="flex gap-4">
            <button 
              onClick={() => { audioService.playClick(); setMode(GameMode.LEVEL_SELECT); }}
              className="m3-button-primary px-10"
            >
              NEXT LEVEL
            </button>
            <button 
              onClick={() => { audioService.playClick(); setMode(GameMode.MENU); }}
              className="m3-button-tonal px-10"
            >
              MENU
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1C1B1F] text-[#E6E1E5]">
      {mode === GameMode.MENU && renderMenu()}
      {mode === GameMode.LEVEL_SELECT && renderLevelSelect()}
      {mode === GameMode.SETTINGS && renderSettings()}
      
      {(mode === GameMode.CLASSIC || mode === GameMode.ADVENTURE) && (
        <div className="relative w-full h-full">
          <GameCanvas 
            key={gameId}
            gameState={state} 
            gameMode={mode}
            currentLevel={currentLevel}
            onGameOver={handleGameOver}
            onWin={handleWin}
            onScoreUpdate={updateHighScoreIfNeeded}
            settings={settings}
            onEat={handleEat}
          />
          
          {renderGameOverlay()}

          {state === GameState.PLAYING && (
            <button 
              onClick={() => { 
                setState(GameState.PAUSED); 
                audioService.playClick(); 
                audioService.stopMusic(); 
              }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 active:scale-90 transition-transform"
            >
              <i className="fas fa-pause"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;