import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';

interface BeatIndicatorProps {
  totalBeats: number;
  currentBeat: number;
  isPlaying: boolean;
}

export const BeatIndicator: React.FC<BeatIndicatorProps> = ({
  totalBeats,
  currentBeat,
  isPlaying,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalBeats }).map((_, index) => (
        <BeatDot
          key={index}
          isActive={index === currentBeat}
          isAccent={index === 0}
          isPlaying={isPlaying}
        />
      ))}
    </View>
  );
};

interface BeatDotProps {
  isActive: boolean;
  isAccent: boolean;
  isPlaying: boolean;
}

const BeatDot: React.FC<BeatDotProps> = ({ isActive, isAccent, isPlaying }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (isActive && isPlaying) {
      scale.value = withSequence(
        withTiming(1.5, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
      opacity.value = withTiming(1, { duration: 100 });
    } else {
      opacity.value = withTiming(0.3, { duration: 200 });
    }
  }, [isActive, isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: isAccent ? colors.primary : colors.textSecondary,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
