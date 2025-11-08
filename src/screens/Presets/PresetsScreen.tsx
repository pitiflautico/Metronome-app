import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { useMetronome } from '../../contexts/MetronomeContext';
import { RootStackParamList, Preset } from '../../types';
import { CustomButton } from '../../components/CustomButton';
import { IconButton } from '../../components/IconButton';
import { storageService } from '../../services/storage';
import Svg, { Path } from 'react-native-svg';

type PresetsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Presets'>;

export const PresetsScreen: React.FC = () => {
  const navigation = useNavigation<PresetsScreenNavigationProp>();
  const { colors } = useTheme();
  const { config, loadConfig } = useMetronome();

  const [presets, setPresets] = useState<Preset[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    const saved = await storageService.getPresets();
    setPresets(saved);
  };

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      Alert.alert('Error', 'Please enter a preset name');
      return;
    }

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      config,
      createdAt: Date.now(),
    };

    await storageService.savePreset(newPreset);
    setPresetName('');
    setShowSaveDialog(false);
    loadPresets();
  };

  const handleLoadPreset = (preset: Preset) => {
    loadConfig(preset.config);
    navigation.goBack();
  };

  const handleDeletePreset = (preset: Preset) => {
    Alert.alert(
      'Delete Preset',
      `Are you sure you want to delete "${preset.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storageService.deletePreset(preset.id);
            loadPresets();
          },
        },
      ]
    );
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

        <Text style={[styles.title, { color: colors.text }]}>PRESETS</Text>

        <IconButton onPress={() => setShowSaveDialog(!showSaveDialog)} size={40}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 5v14M5 12h14"
              stroke={colors.text}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </IconButton>
      </View>

      {/* Save Dialog */}
      {showSaveDialog && (
        <View style={[styles.saveDialog, { backgroundColor: colors.card }]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Preset Name"
            placeholderTextColor={colors.textSecondary}
            value={presetName}
            onChangeText={setPresetName}
          />
          <View style={styles.dialogButtons}>
            <CustomButton
              title="Cancel"
              onPress={() => {
                setShowSaveDialog(false);
                setPresetName('');
              }}
              variant="secondary"
              size="small"
            />
            <CustomButton
              title="Save"
              onPress={handleSavePreset}
              variant="primary"
              size="small"
            />
          </View>
        </View>
      )}

      {/* Presets List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {presets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No presets saved yet.{'\n'}Tap + to save your current configuration.
            </Text>
          </View>
        ) : (
          presets.map((preset) => (
            <View
              key={preset.id}
              style={[styles.presetCard, { backgroundColor: colors.card }]}
            >
              <TouchableOpacity
                style={styles.presetInfo}
                onPress={() => handleLoadPreset(preset)}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetName, { color: colors.text }]}>
                  {preset.name}
                </Text>
                <View style={styles.presetDetails}>
                  <Text style={[styles.presetDetail, { color: colors.textSecondary }]}>
                    {preset.config.bpm} BPM
                  </Text>
                  <Text style={[styles.presetDetail, { color: colors.textSecondary }]}>
                    {preset.config.timeSignature.numerator}/{preset.config.timeSignature.denominator}
                  </Text>
                  <Text style={[styles.presetDetail, { color: colors.textSecondary }]}>
                    {preset.config.soundType.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePreset(preset)}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                    stroke={colors.error}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          ))
        )}
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
  saveDialog: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  presetDetail: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
});
