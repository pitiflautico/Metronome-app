import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useMetronome } from '../../contexts/MetronomeContext';
import { BPMDial } from '../../components/BPMDial';
import { BeatIndicator } from '../../components/BeatIndicator';
import { IconButton } from '../../components/IconButton';
import { RootStackParamList, TimeSignature, SoundType, SoundModifications } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { adsManager, BannerAdSize } from '../../services/adsManager';
import { BannerAd } from 'react-native-google-mobile-ads';
import Svg, { Path } from 'react-native-svg';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useTheme();
  const {
    config,
    isPlaying,
    currentBeat,
    setBPM,
    setTimeSignature,
    setSoundType,
    setSoundModifications,
    toggle,
  } = useMetronome();

  useEffect(() => {
    audioEngine.initialize();
    return () => {
      audioEngine.cleanup();
    };
  }, []);

  const handleBPMIncrement = () => {
    const newBPM = Math.min(config.bpm + 1, 240);
    setBPM(newBPM);
  };

  const handleBPMDecrement = () => {
    const newBPM = Math.max(config.bpm - 1, 40);
    setBPM(newBPM);
  };

  const handlePlay = () => {
    toggle();
    if (!isPlaying) {
      adsManager.incrementPlayCount();
    }
  };

  const handleTimeSignaturePress = () => {
    navigation.navigate('TimeSignature', {
      currentSignature: config.timeSignature,
      onConfirm: (signature: TimeSignature) => {
        setTimeSignature(signature);
      },
    });
  };

  const handleSoundPress = () => {
    navigation.navigate('SoundLibrary', {
      currentSound: config.soundType,
      onConfirm: (sound: SoundType) => {
        setSoundType(sound);
      },
    });
  };

  const handleModifySoundPress = () => {
    navigation.navigate('ModifySound', {
      currentModifications: config.soundModifications,
      onConfirm: (modifications: SoundModifications) => {
        setSoundModifications(modifications);
      },
    });
  };

  const handlePresetsPress = () => {
    navigation.navigate('Presets');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleHistoryPress = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton onPress={handlePresetsPress} size={40}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 6h18M3 12h18M3 18h18"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </IconButton>

        <View style={styles.logoContainer}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
              stroke={colors.primary}
              strokeWidth={2}
              fill="none"
            />
          </Svg>
          <Text style={[styles.logoText, { color: colors.text }]}>METROPULSE</Text>
        </View>

        <IconButton onPress={handleSettingsPress} size={40}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 6h16M4 12h16M4 18h16"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </IconButton>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Time Signature */}
        <TouchableOpacity
          style={[styles.timeSignatureContainer, { backgroundColor: colors.card }]}
          onPress={handleTimeSignaturePress}
        >
          <Text style={[styles.timeSignature, { color: colors.text }]}>
            {config.timeSignature.numerator}/{config.timeSignature.denominator}
          </Text>
        </TouchableOpacity>

        {/* Beat Indicator */}
        <View style={styles.beatIndicatorContainer}>
          <BeatIndicator
            totalBeats={config.timeSignature.numerator}
            currentBeat={currentBeat}
            isPlaying={isPlaying}
          />
        </View>

        {/* Settings Icon */}
        <TouchableOpacity style={styles.settingsIcon} onPress={handleModifySoundPress}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              stroke={colors.textSecondary}
              strokeWidth={2}
            />
            <Path
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
              stroke={colors.textSecondary}
              strokeWidth={2}
            />
          </Svg>
        </TouchableOpacity>

        {/* BPM Display and Controls */}
        <View style={styles.bpmContainer}>
          <TouchableOpacity style={styles.bpmButton} onPress={handleBPMDecrement}>
            <Text style={[styles.bpmButtonText, { color: colors.text }]}>−</Text>
          </TouchableOpacity>

          <View style={styles.bpmDisplay}>
            <Text style={[styles.bpm, { color: colors.text }]}>{config.bpm}</Text>
            <Text style={[styles.bpmLabel, { color: colors.textSecondary }]}>BPM</Text>
          </View>

          <TouchableOpacity style={styles.bpmButton} onPress={handleBPMIncrement}>
            <Text style={[styles.bpmButtonText, { color: colors.text }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Dial */}
        <View style={styles.dialContainer}>
          <BPMDial bpm={config.bpm} isPlaying={isPlaying} currentBeat={currentBeat} />
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <IconButton onPress={handleSoundPress} size={48}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
                stroke={colors.text}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </IconButton>

          <TouchableOpacity
            style={[
              styles.playButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={handlePlay}
          >
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              {isPlaying ? (
                <>
                  <Path d="M6 4h4v16H6z" fill="#FFFFFF" />
                  <Path d="M14 4h4v16h-4z" fill="#FFFFFF" />
                </>
              ) : (
                <Path d="M8 5v14l11-7z" fill="#FFFFFF" />
              )}
            </Svg>
          </TouchableOpacity>

          <IconButton onPress={handleHistoryPress} size={48}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 18V5l12-2v13M6 15h3v8H6v-8z"
                stroke={colors.text}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </IconButton>
        </View>
      </ScrollView>

      {/* Banner Ad */}
      <View style={styles.adContainer}>
        <BannerAd
          unitId={adsManager.getBannerAdUnitId()}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  timeSignatureContainer: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSignature: {
    fontSize: 24,
    fontWeight: '700',
  },
  beatIndicatorContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  settingsIcon: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  bpmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 40,
  },
  bpmButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmButtonText: {
    fontSize: 40,
    fontWeight: '300',
  },
  bpmDisplay: {
    alignItems: 'center',
  },
  bpm: {
    fontSize: 64,
    fontWeight: '300',
    lineHeight: 64,
  },
  bpmLabel: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 4,
  },
  dialContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  adContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
