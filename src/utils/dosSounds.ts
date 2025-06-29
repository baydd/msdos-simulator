export class DOSSoundManager {
  private audioContext?: AudioContext;
  
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
  
  async playBeep(frequency: number = 800, duration: number = 200) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }
  
  async playBootSound() {
    if (!this.audioContext) return;
    
    // PC Speaker boot beep
    await this.playBeep(1000, 100);
    setTimeout(() => this.playBeep(800, 100), 150);
  }
  
  async playKeypress() {
    if (!this.audioContext) return;
    
    // Mechanical keyboard click
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 2000 + Math.random() * 500;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }
  
  async playDoomMusic() {
    if (!this.audioContext) return;
    
    // E1M1 - At Doom's Gate melody simulation
    const notes = [
      { freq: 82.41, duration: 0.5 },   // E2
      { freq: 87.31, duration: 0.5 },   // F2
      { freq: 98.00, duration: 0.5 },   // G2
      { freq: 82.41, duration: 0.5 },   // E2
      { freq: 87.31, duration: 0.5 },   // F2
      { freq: 110.00, duration: 0.5 },  // A2
      { freq: 82.41, duration: 0.5 },   // E2
      { freq: 87.31, duration: 0.5 },   // F2
    ];
    
    let time = this.audioContext.currentTime;
    
    notes.forEach(note => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
      
      oscillator.start(time);
      oscillator.stop(time + note.duration);
      
      time += note.duration;
    });
  }
}

export const dosSoundManager = new DOSSoundManager();