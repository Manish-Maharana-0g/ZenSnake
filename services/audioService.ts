
class AudioService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicEnabled: boolean = true;
  private musicTimeoutId: number | null = null;
  private currentStep: number = 0;
  private isDefeatMode: boolean = false;

  private async ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    return this.ctx;
  }

  init() {
    this.ensureContext();
  }

  setEnabled(val: boolean) {
    this.enabled = val;
  }

  setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
    if (!val) {
      this.stopMusic();
    }
  }

  setDefeatMode(val: boolean) {
    this.isDefeatMode = val;
  }

  private async playShortTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    const ctx = await this.ensureContext();
    if (ctx.state !== 'running') return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // In defeat mode, we drop the frequency for a "warped/slowed" effect
    const finalFreq = this.isDefeatMode ? freq * 0.7 : freq;
    const finalDuration = this.isDefeatMode ? duration * 2 : duration;

    osc.type = type;
    osc.frequency.setValueAtTime(finalFreq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + finalDuration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + finalDuration);
  }

  private async playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.enabled) return;
    await this.playShortTone(freq, type, duration, volume);
  }

  async startMusic(reset: boolean = false) {
    if (!this.musicEnabled || this.musicTimeoutId !== null) return;
    await this.ensureContext();
    this.isDefeatMode = false;
    if (reset) this.currentStep = 0;
    this.runMusicStep();
  }

  private runMusicStep = async () => {
    if (!this.musicEnabled) return;

    const baseMelody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 196.00];
    const variationMelody = [261.63, 349.23, 392.00, 587.33, 523.25, 392.00, 349.23, 246.94];
    const bass = [130.81, 164.81, 196.00, 130.81];

    const isSecondHalf = this.currentStep % 16 >= 8;
    const step = this.currentStep % 8;
    const melody = isSecondHalf ? variationMelody : baseMelody;
    
    // Rhythmic Tip-Taps (Increased volumes)
    if (step % 2 === 0) {
      this.playShortTone(melody[step], 'triangle', 0.1, 0.08);
    } else if (step % 4 === 3) {
      // Occasional higher "tip" for variation
      this.playShortTone(melody[step] * 1.5, 'sine', 0.05, 0.04);
    } else {
      this.playShortTone(melody[step] * 0.5, 'sine', 0.08, 0.06);
    }

    // Bass Heartbeat (Increased volume)
    if (step % 4 === 0) {
      const bassIdx = Math.floor((this.currentStep % 16) / 4);
      this.playShortTone(bass[bassIdx], 'sine', 0.25, 0.12);
    }

    this.currentStep++;

    // Calculate next step timing
    const baseInterval = 180;
    const interval = this.isDefeatMode ? baseInterval * 2.5 : baseInterval;

    this.musicTimeoutId = window.setTimeout(this.runMusicStep, interval);
  };

  stopMusic() {
    if (this.musicTimeoutId !== null) {
      window.clearTimeout(this.musicTimeoutId);
      this.musicTimeoutId = null;
    }
  }

  playEat() {
    this.playTone(660, 'sine', 0.1, 0.2);
    setTimeout(() => this.playTone(880, 'sine', 0.1, 0.2), 50);
  }

  playDie() {
    this.playTone(150, 'sawtooth', 0.3, 0.2);
    this.playTone(100, 'square', 0.5, 0.1);
  }

  playWin() {
    const tones = [523.25, 659.25, 783.99, 1046.50];
    tones.forEach((t, i) => {
      setTimeout(() => this.playTone(t, 'sine', 0.2, 0.1), i * 100);
    });
  }

  playClick() {
    this.playTone(440, 'sine', 0.05, 0.15);
  }
}

export const audioService = new AudioService();
