class SoundService {
  private ctx: AudioContext | null = null;
  private masterVolume: number = 0.8;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.25;
  private isMuted: boolean = false;
  private _isSfxEnabled: boolean = true;
  private _isMusicEnabled: boolean = true;
  private isVoiceEnabled: boolean = true;
  private isVibrationEnabled: boolean = true;
  private ambientOsc: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('tb_quest_sound_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedSfx = localStorage.getItem('tb_quest_sfx_enabled');
      if (savedSfx !== null) {
        this._isSfxEnabled = savedSfx === 'true';
      }
      const savedMusic = localStorage.getItem('tb_quest_music_enabled');
      if (savedMusic !== null) {
        this._isMusicEnabled = savedMusic === 'true';
      }
      const savedMaster = localStorage.getItem('tb_quest_master_vol');
      if (savedMaster) this.masterVolume = parseFloat(savedMaster);
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(master: number, sfx: number, music: number) {
    this.masterVolume = master;
    this.sfxVolume = sfx;
    this.musicVolume = music;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tb_quest_master_vol', master.toString());
    }
    if (this.ambientGain && this.ctx) {
      const targetVol = (!this.isMuted && this._isMusicEnabled) ? this.musicVolume * 0.12 : 0;
      this.ambientGain.gain.setValueAtTime(targetVol, this.ctx.currentTime);
    }
  }

  public toggleMute(muted?: boolean) {
    this.isMuted = muted !== undefined ? muted : !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tb_quest_sound_muted', this.isMuted.toString());
    }
    if (this.ambientGain && this.ctx) {
      const targetVol = (!this.isMuted && this._isMusicEnabled) ? this.musicVolume * 0.12 : 0;
      this.ambientGain.gain.setValueAtTime(targetVol, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getSfxEnabled(): boolean {
    return this._isSfxEnabled;
  }

  public setSfxEnabled(enabled: boolean) {
    this._isSfxEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tb_quest_sfx_enabled', enabled.toString());
    }
  }

  public toggleSfx(): boolean {
    const next = !this._isSfxEnabled;
    this.setSfxEnabled(next);
    return next;
  }

  public getMusicEnabled(): boolean {
    return this._isMusicEnabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this._isMusicEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tb_quest_music_enabled', enabled.toString());
    }
    if (enabled) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
  }

  public toggleMusic(): boolean {
    const next = !this._isMusicEnabled;
    this.setMusicEnabled(next);
    return next;
  }

  public isMusicEnabled(): boolean {
    return this._isMusicEnabled;
  }

  public isSoundEnabled(): boolean {
    return this._isSfxEnabled;
  }

  public toggleSound(): boolean {
    return this.toggleSfx();
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
  }

  public setVibrationEnabled(enabled: boolean) {
    this.isVibrationEnabled = enabled;
  }

  private vibrate(pattern: number | number[]) {
    if (this.isVibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore
      }
    }
  }

  // 1. BUTTON CLICKS (Volume 20%)
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

    const vol = this.masterVolume * this.sfxVolume * 0.20;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
    this.vibrate(10);
  }

  public playLightTap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);

    const vol = this.masterVolume * this.sfxVolume * 0.15;
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // 2. LOGIN / LOGOUT SOUNDS
  public playLoginSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const vol = this.masterVolume * this.sfxVolume * 0.35;
      gain.gain.setValueAtTime(vol, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.2);
    });
    this.vibrate([20, 30, 20]);
  }

  public playLoginFail() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.25);

    const vol = this.masterVolume * this.sfxVolume * 0.30;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
    this.vibrate(60);
  }

  public playLogoutSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.15);

    const vol = this.masterVolume * this.sfxVolume * 0.20;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 3. LEARNING MODULES & ARTICLES
  public playPageFlip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

    const vol = this.masterVolume * this.sfxVolume * 0.20;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playArticleClose() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.06);

    const vol = this.masterVolume * this.sfxVolume * 0.15;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playModuleComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      const vol = this.masterVolume * this.sfxVolume * 0.45;
      gain.gain.setValueAtTime(vol, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.25);
    });
    this.vibrate([30, 40, 30]);
  }

  // 4. QUIZ SOUNDS
  public playNextQuestion() {
    this.playClick();
  }

  public playCorrect() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.setValueAtTime(659.25, now + 0.08);
    osc1.frequency.setValueAtTime(783.99, now + 0.16);

    osc2.frequency.setValueAtTime(261.63, now);
    osc2.frequency.setValueAtTime(329.63, now + 0.08);
    osc2.frequency.setValueAtTime(392.00, now + 0.16);

    const vol = this.masterVolume * this.sfxVolume * 0.35;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
    this.vibrate([30, 50, 30]);
  }

  public playIncorrect() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(130, now + 0.12);

    const vol = this.masterVolume * this.sfxVolume * 0.25;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
    this.vibrate(60);
  }

  public playQuizComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 to E6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const vol = this.masterVolume * this.sfxVolume * 0.50;
      gain.gain.setValueAtTime(vol, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
    this.vibrate([50, 50, 50, 100]);
  }

  // 5. XP, BADGES & FANFARE (Volume 45% - 50%)
  public playXpEarned() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const vol = this.masterVolume * this.sfxVolume * 0.45;
      gain.gain.setValueAtTime(vol, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.18);
    });
  }

  public playBadgeUnlocked() {
    this.playTrophy();
  }

  public playLevelUnlocked() {
    this.playTrophy();
  }

  public playFanfare() {
    this.playQuizComplete();
  }

  public playTrophy() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const vol = this.masterVolume * this.sfxVolume * 0.45;
      gain.gain.setValueAtTime(vol, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
    this.vibrate([40, 40, 40, 40, 80]);
  }

  // 6. NOTIFICATIONS & LIVE UPDATES (Volume 25%)
  public playNotification() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

    const vol = this.masterVolume * this.sfxVolume * 0.25;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playLiveTick() {
    this.playNotification();
  }

  // 7. CLINICAL CASES
  public playMedicalBeep() {
    this.playHeartbeat();
  }

  public playCorrectDiagnosis() {
    this.playCorrect();
  }

  public playIncorrectDiagnosis() {
    this.playIncorrect();
  }

  public playHeartbeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);

    const vol = this.masterVolume * this.sfxVolume * 0.30;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
    this.vibrate(25);
  }

  // 8. MINI GAMES
  public playGameStart() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      const vol = this.masterVolume * this.sfxVolume * 0.30;
      gain.gain.setValueAtTime(vol, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.15);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.15);
    });
  }

  public playGameTick() {
    this.playClick();
  }

  public playGameError() {
    this.playIncorrect();
  }

  public playGameComplete() {
    this.playQuizComplete();
  }

  // 9. DASHBOARD & PROGRESS
  public playDashboardStartup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now);
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.25);

    const vol = this.masterVolume * this.sfxVolume * 0.25;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playProgressChime() {
    this.playCorrect();
  }

  // 10. ADMIN & FACULTY PANELS
  public playSaveSuccess() {
    this.playLoginSuccess();
  }

  public playDeleteSuccess() {
    this.playIncorrect();
  }

  public playUploadSuccess() {
    this.playNotification();
  }

  // Ambient Medical Soundtrack: Calm, Modern, Medical, Futuristic, Investigative
  public startAmbientMusic() {
    if (this.isAmbientPlaying || !this._isMusicEnabled || this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      // Deep calm medical drone: A2 (110Hz) & E3 (164.81Hz)
      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(110.0, this.ctx.currentTime);

      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(164.81, this.ctx.currentTime);

      // Lowpass filter for smooth warmth
      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      this.ambientOsc.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      const targetVol = this.musicVolume * 0.14; // soothing, unobtrusive
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetVol), this.ctx.currentTime + 1.2);

      this.ambientOsc.start();
      this.ambientOsc2.start();
      this.isAmbientPlaying = true;
    } catch (e) {
      // Ignore
    }
  }

  public stopAmbientMusic() {
    if (this.isAmbientPlaying && this.ctx && this.ambientGain) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          if (this.ambientOsc) {
            try { this.ambientOsc.stop(); this.ambientOsc.disconnect(); } catch (e) {}
            this.ambientOsc = null;
          }
          if (this.ambientOsc2) {
            try { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); } catch (e) {}
            this.ambientOsc2 = null;
          }
          this.isAmbientPlaying = false;
        }, 650);
      } catch (e) {
        this.isAmbientPlaying = false;
      }
    } else {
      this.isAmbientPlaying = false;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.isVoiceEnabled || this.isMuted) {
      if (onEnd) onEnd();
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // 12. REALISTIC SNAKE & LADDER GAME SOUND EFFECTS
  public playDiceRoll() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Rapid tumbling clicks followed by table impact
    for (let i = 0; i < 7; i++) {
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      clickOsc.type = 'triangle';
      const freq = 280 + Math.random() * 220;
      clickOsc.frequency.setValueAtTime(freq, now + i * 0.045);

      const vol = this.masterVolume * this.sfxVolume * 0.22;
      clickGain.gain.setValueAtTime(vol, now + i * 0.045);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.025);

      clickOsc.start(now + i * 0.045);
      clickOsc.stop(now + i * 0.045 + 0.025);
    }
    // Impact thud on table
    const impactOsc = this.ctx.createOscillator();
    const impactGain = this.ctx.createGain();
    impactOsc.connect(impactGain);
    impactGain.connect(this.ctx.destination);
    impactOsc.type = 'sine';
    impactOsc.frequency.setValueAtTime(140, now + 0.32);
    impactOsc.frequency.exponentialRampToValueAtTime(50, now + 0.42);
    impactGain.gain.setValueAtTime(this.masterVolume * this.sfxVolume * 0.25, now + 0.32);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    impactOsc.start(now + 0.32);
    impactOsc.stop(now + 0.42);

    this.vibrate([10, 15, 20]);
  }

  public playMoveStep() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Subtle, clean clinical navigation tick
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.04); // G5

    const vol = this.masterVolume * this.sfxVolume * 0.16;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
    this.vibrate(8);
  }

  public playLadderClimb() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Ascending arpeggio: C5, E5, G5, C6, E6
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const vol = this.masterVolume * this.sfxVolume * 0.30;
      gain.gain.setValueAtTime(vol, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.20);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.20);
    });
    this.vibrate([15, 20, 25, 30]);
  }

  public playSnakeSlide() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Subtle descending tone for clinical pitfall
    osc.type = 'sine';
    osc.frequency.setValueAtTime(392.00, now); // G4
    osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.32); // D3

    const vol = this.masterVolume * this.sfxVolume * 0.22;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.start(now);
    osc.stop(now + 0.32);
    this.vibrate([30, 20, 30]);
  }

  public playTimerTick() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

    const vol = this.masterVolume * this.sfxVolume * 0.12;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  public playBonusEarned() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E major chord
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      const vol = this.masterVolume * this.sfxVolume * 0.30;
      gain.gain.setValueAtTime(vol, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.22);
    });
    this.vibrate([20, 25, 35]);
  }

  public playLevelUnlock() {
    if (this.isMuted || !this.isSfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440.00, 554.37, 659.25, 880.00, 1108.73, 1318.51]; // A major triumphant chord
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      const vol = this.masterVolume * this.sfxVolume * 0.32;
      gain.gain.setValueAtTime(vol, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.35);
    });
    this.vibrate([30, 40, 50, 60]);
  }
}

export const soundService = new SoundService();
