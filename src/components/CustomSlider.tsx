import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  label: string;
  onValueChange: (value: number) => void;
  step?: number;
}

const SLIDER_HEIGHT = 200;
const TRACK_WIDTH = 6;
const THUMB_SIZE = 24;

export const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  label,
  onValueChange,
  step = 1,
}) => {
  const { colors } = useTheme();
  const [localValue, setLocalValue] = useState(value);

  const valueToPosition = (val: number): number => {
    return ((val - min) / (max - min)) * SLIDER_HEIGHT;
  };

  const positionToValue = (pos: number): number => {
    let val = min + (pos / SLIDER_HEIGHT) * (max - min);
    val = Math.max(min, Math.min(max, val));
    if (step) {
      val = Math.round(val / step) * step;
    }
    return val;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      const { locationY } = evt.nativeEvent;
      const position = SLIDER_HEIGHT - locationY;
      const newValue = positionToValue(position);
      setLocalValue(newValue);
      onValueChange(newValue);
    },
    onPanResponderMove: (evt, gestureState) => {
      const position = SLIDER_HEIGHT - gestureState.moveY + gestureState.y0;
      const boundedPosition = Math.max(0, Math.min(SLIDER_HEIGHT, position));
      const newValue = positionToValue(boundedPosition);
      setLocalValue(newValue);
      onValueChange(newValue);
    },
  });

  const thumbPosition = valueToPosition(localValue);

  return (
    <View style={styles.container}>
      <Text style={[styles.valueText, { color: colors.primary }]}>
        {localValue > 0 ? '+' : ''}{localValue}
      </Text>
      <View
        style={[styles.trackContainer, { height: SLIDER_HEIGHT }]}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.track,
            {
              backgroundColor: colors.border,
              width: TRACK_WIDTH,
            },
          ]}
        />
        <View
          style={[
            styles.filledTrack,
            {
              backgroundColor: colors.primary,
              width: TRACK_WIDTH,
              height: thumbPosition,
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: '#FFFFFF',
              borderColor: colors.primary,
              bottom: thumbPosition - THUMB_SIZE / 2,
            },
          ]}
        />
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  trackContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    bottom: 0,
    height: SLIDER_HEIGHT,
    borderRadius: 3,
  },
  filledTrack: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    textTransform: 'uppercase',
  },
});
