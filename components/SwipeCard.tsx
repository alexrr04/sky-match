import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
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

  useEffect(() => {
    translateX.value = 0;
  }, [optionLeft, optionRight]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: () => {
      translateX.value = 0;
    },
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      const swipeDistance = translateX.value;
      if (swipeDistance > SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('right');
      } else if (swipeDistance < -SWIPE_THRESHOLD) {
        runOnJS(onSwipe)('left');
      }
      translateX.value = withSpring(0);
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = translateX.value / 25;
    const scale = Math.abs(translateX.value) > SWIPE_THRESHOLD ? 0.95 : 1;
    
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation}deg` },
        { scale },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View 
          style={[
            styles.card, 
            animatedStyle, 
            { backgroundColor: '#fff' }
          ]}
>
          <View style={styles.optionContainer}>
            <View style={styles.optionLeft}>
              <Ionicons name="arrow-back-circle" size={24} color={Colors.light.accent} />
              <Text style={[styles.optionText, styles.leftText]}>{optionLeft}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.optionRight}>
              <Text style={[styles.optionText, styles.rightText]}>{optionRight}</Text>
              <Ionicons name="arrow-forward-circle" size={24} color={Colors.light.primary} />
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  divider: {
    width: 2,
    height: '80%',
    backgroundColor: Colors.light.secondary,
    opacity: 0.5,
  },
  card: {
    width: width * 0.85,
    height: height * 0.3,
    backgroundColor: '#fff',
    overflow: 'hidden',
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
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: width * 0.04,
    gap: 12,
  },
  optionRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: width * 0.04,
    gap: 12,
  },
  optionText: {
    fontSize: Math.min(width * 0.04, 18),
    fontWeight: 'bold',
    flex: 1,
  },
  leftText: {
    color: Colors.light.accent,
    textAlign: 'left',
  },
  rightText: {
    color: Colors.light.primary,
    textAlign: 'right',
  },
});
