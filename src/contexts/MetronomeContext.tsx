import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MetronomeConfig,
  TimeSignature,
  SubdivisionType,
  SoundType,
  SoundModifications,
  Session,
} from '../types';
import { audioEngine } from '../services/audioEngine';
import { storageService } from '../services/storage';

interface MetronomeContextType {
  config: MetronomeConfig;
  isPlaying: boolean;
  currentBeat: number;
  currentSession: Session | null;
  setBPM: (bpm: number) => void;
  setTimeSignature: (signature: TimeSignature) => void;
  setSubdivision: (subdivision: SubdivisionType) => void;
  setSoundType: (sound: SoundType) => void;
  setSoundModifications: (modifications: SoundModifications) => void;
  setVolume: (volume: number) => void;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  loadConfig: (config: MetronomeConfig) => void;
}

const defaultSoundModifications: SoundModifications = {
  enabled: false,
  pitch: 0,
  low: 0,
  mid: 0,
  high: 0,
};

const defaultConfig: MetronomeConfig = {
  bpm: 120,
  timeSignature: { numerator: 4, denominator: 4 },
  subdivision: 'none',
  soundType: 'click',
  soundModifications: defaultSoundModifications,
  volume: 1.0,
};

const MetronomeContext = createContext<MetronomeContextType | undefined>(undefined);

export const MetronomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MetronomeConfig>(defaultConfig);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    loadLastConfig();
    return () => {
      audioEngine.stop();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioEngine.configure(config);
      audioEngine.start(handleBeatChange);
    }
  }, [config, isPlaying]);

  const loadLastConfig = async () => {
    const lastConfig = await storageService.getLastConfig();
    if (lastConfig) {
      setConfig(lastConfig);
    }
  };

  const saveConfig = async (newConfig: MetronomeConfig) => {
    await storageService.saveLastConfig(newConfig);
  };

  const handleBeatChange = (beat: number) => {
    setCurrentBeat(beat);
  };

  const setBPM = (bpm: number) => {
    const newConfig = { ...config, bpm };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const setTimeSignature = (timeSignature: TimeSignature) => {
    const newConfig = { ...config, timeSignature };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const setSubdivision = (subdivision: SubdivisionType) => {
    const newConfig = { ...config, subdivision };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const setSoundType = (soundType: SoundType) => {
    const newConfig = { ...config, soundType };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const setSoundModifications = (soundModifications: SoundModifications) => {
    const newConfig = { ...config, soundModifications };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const setVolume = (volume: number) => {
    const newConfig = { ...config, volume };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const start = async () => {
    const session: Session = {
      id: Date.now().toString(),
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
      bpm: config.bpm,
      timeSignature: config.timeSignature,
      soundType: config.soundType,
    };
    setCurrentSession(session);
    setIsPlaying(true);
  };

  const stop = async () => {
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentBeat(0);

    if (currentSession) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - currentSession.startTime) / 1000);
      const completedSession = {
        ...currentSession,
        endTime,
        duration,
      };
      await storageService.saveSession(completedSession);
      setCurrentSession(null);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  };

  const loadConfig = (newConfig: MetronomeConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  return (
    <MetronomeContext.Provider
      value={{
        config,
        isPlaying,
        currentBeat,
        currentSession,
        setBPM,
        setTimeSignature,
        setSubdivision,
        setSoundType,
        setSoundModifications,
        setVolume,
        start,
        stop,
        toggle,
        loadConfig,
      }}
    >
      {children}
    </MetronomeContext.Provider>
  );
};

export const useMetronome = (): MetronomeContextType => {
  const context = useContext(MetronomeContext);
  if (!context) {
    throw new Error('useMetronome must be used within MetronomeProvider');
  }
  return context;
};
