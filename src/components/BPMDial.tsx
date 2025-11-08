import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const DIAL_SIZE = width * 0.65;
const STROKE_WIDTH = 8;

interface BPMDialProps {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
}

export const BPMDial: React.FC<BPMDialProps> = ({ bpm, isPlaying, currentBeat }) => {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      rotation.value = withTiming(rotation.value + 360, {
        duration: interval,
        easing: Easing.linear,
      });
    }
  }, [currentBeat, isPlaying, bpm]);

  useEffect(() => {
    if (isPlaying && currentBeat === 0) {
      scale.value = withTiming(1.05, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 200 });
      });
    }
  }, [currentBeat, isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Calculate progress for circular arc (0 to 240 degrees = 40 to 240 BPM)
  const minBPM = 40;
  const maxBPM = 240;
  const progress = ((bpm - minBPM) / (maxBPM - minBPM)) * 270; // 270 degrees arc

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.dialContainer}>
        {/* Background Circle */}
        <View
          style={[
            styles.circle,
            {
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
            },
          ]}
        >
          {/* Tick marks */}
          <View style={styles.tickContainer}>
            {Array.from({ length: 12 }).map((_, index) => {
              const angle = (index * 30 - 45) * (Math.PI / 180);
              const tickLength = index % 3 === 0 ? 16 : 10;
              const tickWidth = index % 3 === 0 ? 3 : 2;
              return (
                <View
                  key={index}
                  style={[
                    styles.tick,
                    {
                      backgroundColor: colors.border,
                      width: tickWidth,
                      height: tickLength,
                      transform: [
                        { translateX: Math.cos(angle) * (DIAL_SIZE / 2 - 25) },
                        { translateY: Math.sin(angle) * (DIAL_SIZE / 2 - 25) },
                        { rotate: `${index * 30 - 45}deg` },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Progress Arc */}
          <Svg
            width={DIAL_SIZE}
            height={DIAL_SIZE}
            style={styles.svg}
          >
            <Circle
              cx={DIAL_SIZE / 2}
              cy={DIAL_SIZE / 2}
              r={(DIAL_SIZE - STROKE_WIDTH) / 2 - 10}
              stroke={colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
            />
            <Circle
              cx={DIAL_SIZE / 2}
              cy={DIAL_SIZE / 2}
              r={(DIAL_SIZE - STROKE_WIDTH) / 2 - 10}
              stroke={colors.primary}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={`${(progress / 360) * Math.PI * (DIAL_SIZE - STROKE_WIDTH - 20)} ${Math.PI * (DIAL_SIZE - STROKE_WIDTH - 20)}`}
              strokeDashoffset={Math.PI * (DIAL_SIZE - STROKE_WIDTH - 20) / 4}
              strokeLinecap="round"
              transform={`rotate(-135 ${DIAL_SIZE / 2} ${DIAL_SIZE / 2})`}
            />
          </Svg>

          {/* Center Text */}
          <View style={styles.centerText}>
            <Text style={[styles.tapText, { color: colors.textSecondary }]}>
              TAP
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialContainer: {
    position: 'relative',
  },
  circle: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tickContainer: {
    position: 'absolute',
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
    borderRadius: 2,
  },
  svg: {
    position: 'absolute',
  },
  centerText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 2,
  },
});
