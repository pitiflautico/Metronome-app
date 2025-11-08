// Sound types
export type SoundType = 'click' | 'ping' | 'stick' | 'wooden' | 'drum';

export interface SoundOption {
  id: SoundType;
  name: string;
  fileName: string;
}

// Time signature types
export interface TimeSignature {
  numerator: number;
  denominator: number;
}

// Subdivision types
export type SubdivisionType = 'none' | 'eighth' | 'triplet' | 'sixteenth';

// Metronome configuration
export interface MetronomeConfig {
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: SubdivisionType;
  soundType: SoundType;
  soundModifications: SoundModifications;
  volume: number;
}

// Sound modifications (EQ)
export interface SoundModifications {
  enabled: boolean;
  pitch: number; // -20 to +20
  low: number;   // -20 to +20
  mid: number;   // -20 to +20
  high: number;  // -20 to +20
}

// Preset
export interface Preset {
  id: string;
  name: string;
  config: MetronomeConfig;
  createdAt: number;
}

// Session history
export interface Session {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  bpm: number;
  timeSignature: TimeSignature;
  soundType: SoundType;
}

// Settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  vibrationEnabled: boolean;
  audioCalibration: number; // ms delay
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  TimeSignature: {
    currentSignature: TimeSignature;
    onConfirm: (signature: TimeSignature) => void;
  };
  SoundLibrary: {
    currentSound: SoundType;
    onConfirm: (sound: SoundType) => void;
  };
  ModifySound: {
    currentModifications: SoundModifications;
    onConfirm: (modifications: SoundModifications) => void;
  };
  Presets: undefined;
  History: undefined;
  Settings: undefined;
};
