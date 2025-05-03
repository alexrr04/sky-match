import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { QuizOption } from '@/constants/QuizQuestions';
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
  optionLeft: QuizOption;
  optionRight: QuizOption;
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
                {optionLeft.image && (
                  <Image 
                    source={optionLeft.image}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.textContainer}>
                  <Ionicons name="arrow-back-circle" size={28} color={Colors.light.accent} />
                  <Text style={[styles.optionText, styles.leftText]}>{optionLeft.label}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.optionRight}>
                {optionRight.image && (
                  <Image 
                    source={optionRight.image}
                    style={styles.optionImage}
                    resizeMode="cover"
                  />
                )}
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
