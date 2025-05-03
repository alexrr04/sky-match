import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { QuizOption } from '@/constants/QuizQuestions';
import { Images } from '@/constants/ImageAssets';
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
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

const springConfig = {
  damping: 12,
  mass: 0.3,
  stiffness: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3,
};

type Props = {
  optionLeft: QuizOption;
  optionRight: QuizOption;
  onSwipe: (direction: 'left' | 'right') => void;
};

export const SwipeCard: React.FC<Props> = ({ optionLeft, optionRight, onSwipe }) => {
  const translateX = useSharedValue(0);
  const isSwipingRight = useSharedValue(false);

  useEffect(() => {
    translateX.value = 0;
  }, [optionLeft, optionRight]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      isSwipingRight.value = event.translationX > 0;
    },
    onEnd: (event) => {
      const swipeDistance = event.translationX;
      const velocity = event.velocityX;

      if (Math.abs(swipeDistance) > SWIPE_THRESHOLD || Math.abs(velocity) > 800) {
        // If swipe is fast enough or passes threshold, complete the swipe
        const direction = swipeDistance > 0 ? 'right' : 'left';
        translateX.value = withSpring(
          direction === 'right' ? width : -width,
          {
            velocity,
            ...springConfig,
          },
          () => runOnJS(onSwipe)(direction)
        );
      } else {
        // Return to center with spring animation
        translateX.value = withSpring(0, springConfig);
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width, 0, width],
      [-30, 0, 30],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.9],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      backgroundColor: '#fff',
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.contentContainer}>
            <View style={styles.optionContainer}>
              <View style={styles.optionLeft}>
                <Image 
                  source={Images[optionLeft.image]}
                  style={styles.optionImage}
                  resizeMode="cover"
                />
                <View style={styles.textContainer}>
                  <Ionicons name="arrow-back-circle" size={28} color={Colors.light.accent} />
                  <Text style={[styles.optionText, styles.leftText]}>{optionLeft.label}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.optionRight}>
                <Image 
                  source={Images[optionRight.image]}
                  style={styles.optionImage}
                  resizeMode="cover"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.optionText, styles.rightText]}>{optionRight.label}</Text>
                  <Ionicons name="arrow-forward-circle" size={28} color={Colors.light.primary} />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    height: height * 0.4,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: width * 0.05,
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  contentContainer: {
    flex: 1,
    padding: width * 0.03,
    justifyContent: 'center',
  },
  divider: {
    width: 2,
    height: '70%',
    backgroundColor: Colors.light.secondary,
    opacity: 0.3,
    marginHorizontal: width * 0.02,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionRight: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionImage: {
    width: '100%',
    height: '80%',
    borderRadius: width * 0.03,
    borderWidth: 2,
    borderColor: Colors.light.secondary,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: Math.min(width * 0.035, 16),
    fontWeight: '600',
    textAlign: 'center',
  },
  leftText: {
    color: Colors.light.accent,
  },
  rightText: {
    color: Colors.light.primary,
  },
});
