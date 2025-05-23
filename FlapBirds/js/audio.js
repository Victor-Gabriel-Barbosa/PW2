class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.musicGain = null;
    this.soundGain = null;
    this.musicEnabled = true;
    this.soundEnabled = true;
    this.isPlaying = false;
    this.currentOscillators = [];
    this.backgroundMusicInterval = null;

    this.init();
  }

  async init() {
    try {
      // Criar contexto de áudio
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Criar nós de ganho
      this.masterGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();
      this.soundGain = this.audioContext.createGain();

      // Conectar nós
      this.musicGain.connect(this.masterGain);
      this.soundGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      // Configurar volumes
      this.masterGain.gain.value = 0.3;
      this.musicGain.gain.value = 0.4;
      this.soundGain.gain.value = 0.6;

    } catch (error) {
      console.warn('Web Audio API não suportada:', error);
    }
  }

  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Música de fundo procedural
  startBackgroundMusic() {
    if (!this.audioContext || !this.musicEnabled || this.isPlaying) return;

    this.isPlaying = true;
    this.playMelodyLoop();
  }

  stopBackgroundMusic() {
    this.isPlaying = false;
    if (this.backgroundMusicInterval) {
      clearInterval(this.backgroundMusicInterval);
      this.backgroundMusicInterval = null;
    }
    this.stopAllOscillators();
  }

  playMelodyLoop() {
    if (!this.isPlaying || !this.musicEnabled) return;

    // Sequência de notas alegres
    const melody = [
      { freq: 523.25, duration: 0.3 }, // C5
      { freq: 587.33, duration: 0.3 }, // D5
      { freq: 659.25, duration: 0.3 }, // E5
      { freq: 698.46, duration: 0.3 }, // F5
      { freq: 783.99, duration: 0.6 }, // G5
      { freq: 659.25, duration: 0.3 }, // E5
      { freq: 523.25, duration: 0.6 }, // C5
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.isPlaying || !this.musicEnabled) return;

      const note = melody[noteIndex];
      this.playTone(note.freq, note.duration, 'triangle', this.musicGain, 0.1);

      noteIndex = (noteIndex + 1) % melody.length;

      setTimeout(playNextNote, note.duration * 1000);
    };

    playNextNote();
  }

  // Som de pulo
  playJumpSound() {
    if (!this.audioContext || !this.soundEnabled) return;

    // Som de "whoosh" ascendente
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.soundGain);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Som de pontuação
  playScoreSound() {
    if (!this.audioContext || !this.soundEnabled) return;

    // Acorde alegre
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', this.soundGain, 0.2);
      }, index * 50);
    });
  }

  // Som de game over
  playGameOverSound() {
    if (!this.audioContext || !this.soundEnabled) return;

    // Sequência descendente dramática
    const notes = [400, 350, 300, 250, 200];

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'sawtooth', this.soundGain, 0.25);
      }, index * 200);
    });
  }

  // Som de power-up coletado
  playPowerUpSound() {
    if (!this.audioContext || !this.soundEnabled) return;
    
    // Som mágico ascendente
    const frequencies = [330, 415, 523, 659, 831]; // E4, Ab4, C5, E5, Ab5
    
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', this.soundGain, 0.3);
      }, index * 80);
    });
  }
  
  // Som de shield ativo
  playShieldSound() {
    if (!this.audioContext || !this.soundEnabled) return;
    
    // Som de proteção com eco
    this.playTone(220, 0.3, 'triangle', this.soundGain, 0.25);
    setTimeout(() => {
      this.playTone(440, 0.2, 'sine', this.soundGain, 0.15);
    }, 100);
  }
  
  // Som de slow motion
  playSlowMotionSound() {
    if (!this.audioContext || !this.soundEnabled) return;
    
    // Som de desaceleração
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.soundGain);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // Função auxiliar para tocar tons
  playTone(frequency, duration, waveType = 'sine', gainNode = this.soundGain, volume = 0.3) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(gainNode);

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    this.currentOscillators.push(oscillator);

    // Limpar referência após parar
    setTimeout(() => {
      const index = this.currentOscillators.indexOf(oscillator);
      if (index > -1) {
        this.currentOscillators.splice(index, 1);
      }
    }, duration * 1000);
  }

  stopAllOscillators() {
    this.currentOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator já parado
      }
    });
    this.currentOscillators = [];
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;

    if (this.musicEnabled) {
      this.startBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }

    return this.musicEnabled;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  setMusicVolume(volume) {
    if (this.musicGain) {
      this.musicGain.gain.value = volume;
    }
  }

  setSoundVolume(volume) {
    if (this.soundGain) {
      this.soundGain.gain.value = volume;
    }
  }
}