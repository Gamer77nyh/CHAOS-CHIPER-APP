
class SoundService {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isMuted = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public async startAmbientDrone() {
    this.init();
    if (!this.ctx || this.droneOsc) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2);
    this.droneGain.connect(this.ctx.destination);

    // Deep low drone
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.setValueAtTime(40, this.ctx.currentTime);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    
    this.droneOsc.connect(filter);
    filter.connect(this.droneGain);
    
    this.droneOsc.start();

    // Add a second oscillating layer for texture
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(41, this.ctx.currentTime);
    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.01, this.ctx.currentTime);
    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start();
  }

  public playTypingSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150 + Math.random() * 50, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playGlitchSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const duration = 0.1;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.droneGain) {
      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx?.currentTime || 0);
    }
    return this.isMuted;
  }
}

export const soundService = new SoundService();
