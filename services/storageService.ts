
import { HighScore, Settings } from '../types';

const STORAGE_KEY_SCORE = 'zen_snake_highscores_v2';
const STORAGE_KEY_SETTINGS = 'zen_snake_settings_v2';

export const storageService = {
  getHighScore(): HighScore {
    const data = localStorage.getItem(STORAGE_KEY_SCORE);
    if (!data) return { classicWalled: 0, classicLooping: 0, levelsCompleted: [] };
    const parsed = JSON.parse(data);
    // Migration helper for old score key if needed
    return {
      classicWalled: parsed.classicWalled ?? parsed.classic ?? 0,
      classicLooping: parsed.classicLooping ?? 0,
      levelsCompleted: parsed.levelsCompleted ?? []
    };
  },
  saveHighScore(score: HighScore) {
    localStorage.setItem(STORAGE_KEY_SCORE, JSON.stringify(score));
  },
  getSettings(): Settings {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const defaultSettings: Settings = { 
      haptics: true, 
      sound: true, 
      music: true, 
      accentColor: '#D0BCFF',
      loopingBorders: true
    };
    if (!data) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(data) };
  },
  saveSettings(settings: Settings) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }
};
