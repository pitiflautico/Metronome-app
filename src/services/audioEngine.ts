import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { MetronomeConfig, SoundType } from '../types';

class AudioEngine {
  private sounds: Map<SoundType, Audio.Sound> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private config: MetronomeConfig | null = null;
  private currentBeat: number = 0;
  private beatCallback: ((beat: number) => void) | null = null;
  private isInitialized: boolean = false;
  private vibrationEnabled: boolean = true;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Load all sound files
      await this.loadSounds();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  private async loadSounds(): Promise<void> {
    // NOTE: Sound files are placeholders. Replace files in assets/sounds/ with real MP3s.
    // Uncomment below when you have real sound files:

    /*
    const soundFiles: Record<SoundType, any> = {
      click: require('../../assets/sounds/click.mp3'),
      ping: require('../../assets/sounds/ping.mp3'),
      stick: require('../../assets/sounds/stick.mp3'),
      wooden: require('../../assets/sounds/wooden.mp3'),
      drum: require('../../assets/sounds/drum.mp3'),
    };

    for (const [type, file] of Object.entries(soundFiles)) {
      try {
        const { sound } = await Audio.Sound.createAsync(file);
        this.sounds.set(type as SoundType, sound);
      } catch (error) {
        console.error(`Error loading sound ${type}:`, error);
      }
    }
    */

    console.log('⚠️ Sound files not loaded. Add real MP3 files to assets/sounds/ and uncomment loadSounds() in audioEngine.ts');
  }

  configure(config: MetronomeConfig): void {
    this.config = config;
  }

  setVibrationEnabled(enabled: boolean): void {
    this.vibrationEnabled = enabled;
  }

  start(beatCallback?: (beat: number) => void): void {
    if (!this.config) {
      console.error('Metronome not configured');
      return;
    }

    this.stop();
    this.currentBeat = 0;
    this.beatCallback = beatCallback || null;

    const interval = (60 / this.config.bpm) * 1000;

    // Play first beat immediately
    this.playBeat();

    // Schedule subsequent beats
    this.intervalId = setInterval(() => {
      this.playBeat();
    }, interval);
  }

  private async playBeat(): Promise<void> {
    if (!this.config) return;

    const { numerator } = this.config.timeSignature;
    const isAccent = this.currentBeat === 0;

    // Play sound
    await this.playSound(isAccent);

    // Vibrate on accent beats
    if (isAccent && this.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (this.vibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Call beat callback
    if (this.beatCallback) {
      this.beatCallback(this.currentBeat);
    }

    // Update beat counter
    this.currentBeat = (this.currentBeat + 1) % numerator;
  }

  private async playSound(isAccent: boolean): Promise<void> {
    if (!this.config) return;

    const sound = this.sounds.get(this.config.soundType);
    if (!sound) {
      // No sound loaded - using haptic feedback only
      return;
    }

    try {
      await sound.setPositionAsync(0);

      // Apply volume (louder for accent beats)
      const volume = isAccent
        ? Math.min(this.config.volume * 1.2, 1.0)
        : this.config.volume * 0.8;

      await sound.setVolumeAsync(volume);

      // Apply pitch modification if enabled
      if (this.config.soundModifications.enabled) {
        const pitchFactor = 1 + (this.config.soundModifications.pitch / 100);
        await sound.setRateAsync(pitchFactor, true);
      } else {
        await sound.setRateAsync(1.0, true);
      }

      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.currentBeat = 0;
  }

  async playPreview(soundType: SoundType): Promise<void> {
    const sound = this.sounds.get(soundType);
    if (!sound) return;

    try {
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(0.8);
      await sound.setRateAsync(1.0, true);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing preview:', error);
    }
  }

  async cleanup(): Promise<void> {
    this.stop();
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error('Error unloading sound:', error);
      }
    }
    this.sounds.clear();
    this.isInitialized = false;
  }
}

export const audioEngine = new AudioEngine();
