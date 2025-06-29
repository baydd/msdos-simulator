export class SoundManager {
  private audioContext?: AudioContext;
  private sounds: Map<string, AudioBuffer> = new Map();
  
  constructor() {
    this.initAudioContext();
  }
  
  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }
  
  async playKeypress() {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 800 + Math.random() * 200;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
  
  async playBoot() {
    if (!this.audioContext) return;
    
    // Create a simple boot sound sequence
    const notes = [440, 554, 659, 880];
    let time = this.audioContext.currentTime;
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      
      oscillator.start(time);
      oscillator.stop(time + 0.3);
      
      time += 0.2;
    });
  }
  
  async playModem() {
    if (!this.audioContext) return;
    
    // Simulate modem connection sounds
    const duration = 2;
    let time = this.audioContext.currentTime;
    
    // Static noise
    for (let i = 0; i < 20; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = Math.random() * 2000 + 500;
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.05, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
      
      oscillator.start(time);
      oscillator.stop(time + duration);
    }
  }
}

export const soundManager = new SoundManager();