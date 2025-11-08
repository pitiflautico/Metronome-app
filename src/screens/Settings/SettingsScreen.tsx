import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList, AppSettings } from '../../types';
import { IconButton } from '../../components/IconButton';
import { storageService } from '../../services/storage';
import { audioEngine } from '../../services/audioEngine';
import Svg, { Path } from 'react-native-svg';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors, themeMode, setThemeMode } = useTheme();

  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [audioCalibration, setAudioCalibration] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await storageService.getSettings();
    if (settings) {
      setVibrationEnabled(settings.vibrationEnabled);
      setAudioCalibration(settings.audioCalibration);
      audioEngine.setVibrationEnabled(settings.vibrationEnabled);
    }
  };

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    const currentSettings = await storageService.getSettings();
    const updated: AppSettings = {
      theme: currentSettings?.theme || themeMode,
      vibrationEnabled: currentSettings?.vibrationEnabled ?? true,
      audioCalibration: currentSettings?.audioCalibration || 0,
      ...newSettings,
    };
    await storageService.saveSettings(updated);
  };

  const handleVibrationToggle = (value: boolean) => {
    setVibrationEnabled(value);
    audioEngine.setVibrationEnabled(value);
    saveSettings({ vibrationEnabled: value });
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
    saveSettings({ theme: mode });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton onPress={() => navigation.goBack()} size={40}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </IconButton>

        <Text style={[styles.title, { color: colors.text }]}>SETTINGS</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>THEME</Text>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'auto' && { backgroundColor: colors.background },
              ]}
              onPress={() => handleThemeChange('auto')}
            >
              <Text style={[styles.themeText, { color: colors.text }]}>Auto</Text>
              {themeMode === 'auto' && (
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
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && { backgroundColor: colors.background },
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[styles.themeText, { color: colors.text }]}>Light</Text>
              {themeMode === 'light' && (
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
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && { backgroundColor: colors.background },
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[styles.themeText, { color: colors.text }]}>Dark</Text>
              {themeMode === 'dark' && (
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
            </TouchableOpacity>
          </View>
        </View>

        {/* Vibration Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>VIBRATION</Text>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Haptic Feedback
              </Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={handleVibrationToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ABOUT</Text>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>
                App Name
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>
                Metronome Beats
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>
                Version
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>
                1.0.0
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>
                Platform
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>
                React Native (Expo)
              </Text>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Made with passion for musicians
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            100% Offline • No Internet Required
          </Text>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 14,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  infoSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
