# 🥁 Metronome Beats - Professional Offline Metronome

A fully functional, 100% offline metronome application built with React Native (Expo) for iOS and Android. Designed for musicians, students, and teachers who need a reliable rhythm tool without internet dependency.

## ✨ Features

### Core Functionality
- **Precise BPM Control**: 40-240 BPM range with smooth adjustments
- **Custom Time Signatures**: Support for 1-16 beats, denominators: 2, 4, 8, 16
- **Multiple Sound Options**: Click, Ping, Stick, Wooden Block, Drum
- **Sound Customization**: 4-band EQ with pitch control
- **Visual Beat Indicator**: Animated beat markers with accent highlighting
- **Haptic Feedback**: Synchronized vibration on beats

### Advanced Features
- **Presets System**: Save and load favorite configurations
- **Practice History**: Track sessions with statistics and analytics
- **Dark/Light Mode**: Auto, manual light, or dark themes
- **100% Offline**: All data stored locally with AsyncStorage
- **Ad Integration**: Banner, Interstitial, and Rewarded ads via AdMob

## 📱 Screenshots

Check the `style_and_design/` folder for UI mockups.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Installation

1. Install dependencies:
```bash
npm install
```

2. **IMPORTANT**: Add sound files to `assets/sounds/`:
   - click.mp3, ping.mp3, stick.mp3, wooden.mp3, drum.mp3
   - See `assets/sounds/README.md` for specifications

3. **IMPORTANT**: Replace placeholder assets in `assets/`:
   - icon.png (1024x1024)
   - adaptive-icon.png (1024x1024)
   - splash.png (1284x2778)

### Running the App

```bash
# Start Expo server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🏗️ Project Structure

```
metronome-beats/
├── App.tsx                 # Main app entry
├── src/
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context providers
│   ├── navigation/         # Navigation setup
│   ├── screens/            # App screens
│   ├── services/           # Business logic
│   └── types/              # TypeScript types
└── assets/                 # Images, sounds
```

## 🔧 Configuration

### AdMob Setup

1. Update Ad Unit IDs in `src/services/adsManager.ts`
2. Configure app.json with your AdMob App IDs

## 📝 Key Technologies

- React Native + Expo
- TypeScript
- React Navigation
- Expo AV (Audio)
- React Native Reanimated
- AsyncStorage
- Google Mobile Ads

## 🚧 TODO Before Release

1. Replace sound files with actual metronome sounds
2. Replace app icons and splash screen
3. Configure AdMob with production IDs
4. Test on physical devices (iOS & Android)

## 📄 License

MIT License

---

**Ready to Practice?** 🎵
