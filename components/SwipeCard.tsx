import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

type Props = {
  optionLeft: string;
  optionRight: string;
  onSwipe: (direction: 'left' | 'right') => void;
};

export const SwipeCard: React.FC<Props> = ({ optionLeft, optionRight, onSwipe }) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  // Reset values when props change
  useEffect(() => {
    translateX.value = 0;
    rotate.value = 0;
  }, [optionLeft, optionRight]);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    },
    onEnd: () => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width, {}, () => {
          runOnJS(onSwipe)('right');
          translateX.value = 0;
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width, {}, () => {
          runOnJS(onSwipe)('left');
          translateX.value = 0;
        });
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.optionContainer}>
            <Text style={styles.optionText}>{optionLeft}</Text>
            <Text style={styles.optionText}>{optionRight}</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: height * 0.3,
    backgroundColor: '#fff',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
  },
  optionText: {
    fontSize: Math.min(width * 0.045, 20),
    fontWeight: 'bold',
    color: '#333',
    width: '45%',
    textAlign: 'center',
    padding: width * 0.02,
  },
});
