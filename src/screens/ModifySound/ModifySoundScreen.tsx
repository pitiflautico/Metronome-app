import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList, SoundModifications } from '../../types';
import { CustomButton } from '../../components/CustomButton';
import { CustomSlider } from '../../components/CustomSlider';
import { IconButton } from '../../components/IconButton';
import Svg, { Path } from 'react-native-svg';

type ModifySoundScreenRouteProp = RouteProp<RootStackParamList, 'ModifySound'>;
type ModifySoundScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModifySound'>;

export const ModifySoundScreen: React.FC = () => {
  const route = useRoute<ModifySoundScreenRouteProp>();
  const navigation = useNavigation<ModifySoundScreenNavigationProp>();
  const { colors } = useTheme();

  const [modifications, setModifications] = useState<SoundModifications>(
    route.params.currentModifications
  );

  const handleToggle = (value: boolean) => {
    setModifications(prev => ({ ...prev, enabled: value }));
  };

  const handlePitchChange = (value: number) => {
    setModifications(prev => ({ ...prev, pitch: value }));
  };

  const handleLowChange = (value: number) => {
    setModifications(prev => ({ ...prev, low: value }));
  };

  const handleMidChange = (value: number) => {
    setModifications(prev => ({ ...prev, mid: value }));
  };

  const handleHighChange = (value: number) => {
    setModifications(prev => ({ ...prev, high: value }));
  };

  const handleSave = () => {
    route.params.onConfirm(modifications);
    navigation.goBack();
  };

  const handlePreview = () => {
    // Preview functionality would play the sound with current modifications
    console.log('Preview sound with modifications:', modifications);
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

        <Text style={[styles.title, { color: colors.text }]}>MODIFY SOUND</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Enable/Disable Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>OFF</Text>
          <Switch
            value={modifications.enabled}
            onValueChange={handleToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={colors.border}
          />
          <Text style={[styles.toggleLabel, { color: colors.text }]}>ON</Text>
        </View>

        {/* Sliders */}
        <View style={styles.slidersContainer}>
          <CustomSlider
            value={modifications.pitch}
            min={-20}
            max={20}
            label="PITCH"
            onValueChange={handlePitchChange}
            step={1}
          />
          <CustomSlider
            value={modifications.low}
            min={-20}
            max={20}
            label="LOW"
            onValueChange={handleLowChange}
            step={1}
          />
          <CustomSlider
            value={modifications.mid}
            min={-20}
            max={20}
            label="MID"
            onValueChange={handleMidChange}
            step={1}
          />
          <CustomSlider
            value={modifications.high}
            min={-20}
            max={20}
            label="HIGH"
            onValueChange={handleHighChange}
            step={1}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <CustomButton
            title="SAVE"
            onPress={handleSave}
            variant="outline"
            size="large"
            style={styles.button}
          />
          <CustomButton
            title="▶ PREVIEW"
            onPress={handlePreview}
            variant="outline"
            size="large"
            style={styles.button}
          />
        </View>
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
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  slidersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    flex: 1,
    maxWidth: 160,
  },
});
