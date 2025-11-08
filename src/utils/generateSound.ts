/**
 * Synthetic Sound Generator for Metronome
 * Generates simple beep sounds without requiring external audio files
 */

import { Audio } from 'expo-av';

/**
 * Generate a simple WAV file as base64
 * This creates a basic beep sound that can be used for the metronome
 */
export function generateBeepWav(frequency: number = 1000, duration: number = 0.05): string {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);

  // WAV file header
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // "RIFF" chunk descriptor
  view.setUint8(0, 'R'.charCodeAt(0));
  view.setUint8(1, 'I'.charCodeAt(0));
  view.setUint8(2, 'F'.charCodeAt(0));
  view.setUint8(3, 'F'.charCodeAt(0));
  view.setUint32(4, 36 + numSamples * 2, true);
  view.setUint8(8, 'W'.charCodeAt(0));
  view.setUint8(9, 'A'.charCodeAt(0));
  view.setUint8(10, 'V'.charCodeAt(0));
  view.setUint8(11, 'E'.charCodeAt(0));

  // "fmt " sub-chunk
  view.setUint8(12, 'f'.charCodeAt(0));
  view.setUint8(13, 'm'.charCodeAt(0));
  view.setUint8(14, 't'.charCodeAt(0));
  view.setUint8(15, ' '.charCodeAt(0));
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);

  // "data" sub-chunk
  view.setUint8(36, 'd'.charCodeAt(0));
  view.setUint8(37, 'a'.charCodeAt(0));
  view.setUint8(38, 't'.charCodeAt(0));
  view.setUint8(39, 'a'.charCodeAt(0));
  view.setUint32(40, numSamples * 2, true);

  // Generate audio samples
  const samples = new Int16Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 10); // Exponential decay
    samples[i] = Math.floor(envelope * Math.sin(2 * Math.PI * frequency * t) * 32767);
  }

  // Combine header and samples
  const wavFile = new Uint8Array(44 + numSamples * 2);
  wavFile.set(new Uint8Array(header), 0);
  wavFile.set(new Uint8Array(samples.buffer), 44);

  // Convert to base64
  let binary = '';
  for (let i = 0; i < wavFile.length; i++) {
    binary += String.fromCharCode(wavFile[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

/**
 * Sound configurations for different metronome types
 */
export const soundConfigs = {
  click: { frequency: 1200, duration: 0.03 },
  ping: { frequency: 1800, duration: 0.05 },
  stick: { frequency: 900, duration: 0.025 },
  wooden: { frequency: 600, duration: 0.04 },
  drum: { frequency: 200, duration: 0.08 },
};
