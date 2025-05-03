import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // value between 0 and 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = '#e0e0e0',
  fillColor = '#3b82f6',
}) => {
  // Start animation value at 0 to ensure full-range coverage
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor, height }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            height,
            width: widthInterpolated,
          } as Animated.AnimatedProps<ViewStyle>,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});

export default ProgressBar;
