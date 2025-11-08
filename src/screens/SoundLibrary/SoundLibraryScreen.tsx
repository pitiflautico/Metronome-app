import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList, SoundType, SoundOption } from '../../types';
import { CustomButton } from '../../components/CustomButton';
import { audioEngine } from '../../services/audioEngine';
import Svg, { Path, Circle } from 'react-native-svg';

type SoundLibraryScreenRouteProp = RouteProp<RootStackParamList, 'SoundLibrary'>;
type SoundLibraryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SoundLibrary'>;

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'click', name: 'CLICK', fileName: 'click.mp3' },
  { id: 'ping', name: 'PING', fileName: 'ping.mp3' },
  { id: 'stick', name: 'STICK', fileName: 'stick.mp3' },
  { id: 'wooden', name: 'WOODEN BLOCK', fileName: 'wooden.mp3' },
  { id: 'drum', name: 'DRUM', fileName: 'drum.mp3' },
];

export const SoundLibraryScreen: React.FC = () => {
  const route = useRoute<SoundLibraryScreenRouteProp>();
  const navigation = useNavigation<SoundLibraryScreenNavigationProp>();
  const { colors } = useTheme();

  const [selectedSound, setSelectedSound] = useState<SoundType>(route.params.currentSound);

  const handleSoundSelect = (soundType: SoundType) => {
    setSelectedSound(soundType);
    audioEngine.playPreview(soundType);
  };

  const handleConfirm = () => {
    route.params.onConfirm(selectedSound);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>CLICK SOUND</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {SOUND_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.soundItem,
              {
                backgroundColor: colors.card,
                borderColor: selectedSound === option.id ? colors.primary : 'transparent',
              },
            ]}
            onPress={() => handleSoundSelect(option.id)}
            activeOpacity={0.7}
          >
            <View style={styles.soundInfo}>
              {selectedSound === option.id && (
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 6L9 17l-5-5"
                    stroke={colors.primary}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
              <Text
                style={[
                  styles.soundName,
                  {
                    color: selectedSound === option.id ? colors.primary : colors.text,
                    fontWeight: selectedSound === option.id ? '600' : '500',
                  },
                ]}
              >
                {option.name}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.playIcon, { backgroundColor: colors.background }]}
              onPress={() => audioEngine.playPreview(option.id)}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} stroke={colors.text} strokeWidth={2} />
                <Path d="M10 8l6 4-6 4z" fill={colors.text} />
              </Svg>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <CustomButton
          title="CONFIRM"
          onPress={handleConfirm}
          variant="outline"
          size="large"
          style={styles.confirmButton}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  soundName: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  playIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  confirmButton: {
    minWidth: 200,
  },
});
