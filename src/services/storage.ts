import AsyncStorage from '@react-native-async-storage/async-storage';
import { MetronomeConfig, Preset, Session, AppSettings } from '../types';

const KEYS = {
  LAST_CONFIG: 'last_config',
  PRESETS: 'presets',
  SESSIONS: 'sessions',
  SETTINGS: 'settings',
};

class StorageService {
  // Config
  async saveLastConfig(config: MetronomeConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  async getLastConfig(): Promise<MetronomeConfig | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.LAST_CONFIG);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading config:', error);
      return null;
    }
  }

  // Presets
  async savePreset(preset: Preset): Promise<void> {
    try {
      const presets = await this.getPresets();
      const updated = [...presets.filter(p => p.id !== preset.id), preset];
      await AsyncStorage.setItem(KEYS.PRESETS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving preset:', error);
    }
  }

  async getPresets(): Promise<Preset[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PRESETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading presets:', error);
      return [];
    }
  }

  async deletePreset(id: string): Promise<void> {
    try {
      const presets = await this.getPresets();
      const updated = presets.filter(p => p.id !== id);
      await AsyncStorage.setItem(KEYS.PRESETS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  }

  // Sessions
  async saveSession(session: Session): Promise<void> {
    try {
      const sessions = await this.getSessions();
      const updated = [session, ...sessions].slice(0, 100); // Keep last 100 sessions
      await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  async getSessions(): Promise<Session[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  async clearSessions(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  }

  // Settings
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings(): Promise<AppSettings | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  }

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.LAST_CONFIG,
        KEYS.PRESETS,
        KEYS.SESSIONS,
        KEYS.SETTINGS,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

export const storageService = new StorageService();
