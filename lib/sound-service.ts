class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playCorrect() {
    this.playTone(880, 'sine', 0.1, 0.05);
  }

  playIncorrect() {
    this.playTone(150, 'square', 0.15, 0.05);
  }

  playTyping() {
    this.playTone(400, 'sine', 0.05, 0.02);
  }

  playCountdown(isGo: boolean = false) {
    this.playTone(isGo ? 880 : 440, 'sine', 0.3, 0.1);
  }

  playFinish() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.4, 0.08), i * 150);
    });
  }
}

export const soundService = new SoundService();
