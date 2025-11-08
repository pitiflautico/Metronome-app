import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList, TimeSignature } from '../../types';
import { CustomButton } from '../../components/CustomButton';
import { BeatIndicator } from '../../components/BeatIndicator';
import { IconButton } from '../../components/IconButton';
import Svg, { Path } from 'react-native-svg';

type TimeSignatureScreenRouteProp = RouteProp<RootStackParamList, 'TimeSignature'>;
type TimeSignatureScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TimeSignature'>;

export const TimeSignatureScreen: React.FC = () => {
  const route = useRoute<TimeSignatureScreenRouteProp>();
  const navigation = useNavigation<TimeSignatureScreenNavigationProp>();
  const { colors } = useTheme();

  const [signature, setSignature] = useState<TimeSignature>(route.params.currentSignature);

  const handleNumeratorIncrement = () => {
    setSignature(prev => ({
      ...prev,
      numerator: Math.min(prev.numerator + 1, 16),
    }));
  };

  const handleNumeratorDecrement = () => {
    setSignature(prev => ({
      ...prev,
      numerator: Math.max(prev.numerator - 1, 1),
    }));
  };

  const handleDenominatorIncrement = () => {
    const validDenominators = [2, 4, 8, 16];
    const currentIndex = validDenominators.indexOf(signature.denominator);
    if (currentIndex < validDenominators.length - 1) {
      setSignature(prev => ({
        ...prev,
        denominator: validDenominators[currentIndex + 1],
      }));
    }
  };

  const handleDenominatorDecrement = () => {
    const validDenominators = [2, 4, 8, 16];
    const currentIndex = validDenominators.indexOf(signature.denominator);
    if (currentIndex > 0) {
      setSignature(prev => ({
        ...prev,
        denominator: validDenominators[currentIndex - 1],
      }));
    }
  };

  const handleConfirm = () => {
    route.params.onConfirm(signature);
    navigation.goBack();
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

        <View style={styles.titleContainer}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
              stroke={colors.primary}
              strokeWidth={2}
              fill="none"
            />
          </Svg>
          <Text style={[styles.title, { color: colors.text }]}>TIME SIGNATURE</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Time Signature Display */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.displayText, { color: colors.text }]}>
            {signature.numerator}/{signature.denominator}
          </Text>
        </View>

        {/* Beat Indicator */}
        <View style={styles.beatIndicatorContainer}>
          <BeatIndicator totalBeats={signature.numerator} currentBeat={0} isPlaying={false} />
        </View>

        {/* Numerator Controls */}
        <View style={styles.controlSection}>
          <TouchableOpacity
            style={[styles.controlButton, { borderColor: colors.border }]}
            onPress={handleNumeratorDecrement}
          >
            <Text style={[styles.controlButtonText, { color: colors.text }]}>−</Text>
          </TouchableOpacity>

          <View style={styles.controlValue}>
            <Text style={[styles.controlNumber, { color: colors.text }]}>
              {signature.numerator}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.controlButton, { borderColor: colors.border }]}
            onPress={handleNumeratorIncrement}
          >
            <Text style={[styles.controlButtonText, { color: colors.text }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Denominator Controls */}
        <View style={styles.controlSection}>
          <TouchableOpacity
            style={[styles.controlButton, { borderColor: colors.border }]}
            onPress={handleDenominatorDecrement}
          >
            <Text style={[styles.controlButtonText, { color: colors.text }]}>−</Text>
          </TouchableOpacity>

          <View style={styles.controlValue}>
            <Text style={[styles.controlNumber, { color: colors.text }]}>
              {signature.denominator}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.controlButton, { borderColor: colors.border }]}
            onPress={handleDenominatorIncrement}
          >
            <Text style={[styles.controlButtonText, { color: colors.text }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Button */}
        <View style={styles.confirmContainer}>
          <CustomButton
            title="CONFIRM"
            onPress={handleConfirm}
            variant="outline"
            size="large"
            style={styles.confirmButton}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  card: {
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  displayText: {
    fontSize: 72,
    fontWeight: '300',
  },
  beatIndicatorContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  controlSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    gap: 32,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 32,
    fontWeight: '300',
  },
  controlValue: {
    width: 80,
    alignItems: 'center',
  },
  controlNumber: {
    fontSize: 64,
    fontWeight: '300',
  },
  confirmContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  confirmButton: {
    minWidth: 200,
  },
});
