import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SwipeCard } from '@/components/SwipeCard';
import { quizQuestions } from '@/constants/QuizQuestions';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing
} from 'react-native-reanimated';

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Question ${currentQuestionIndex + 1}: User chose ${direction === 'left' ? currentQuestion.optionLeft : currentQuestion.optionRight}`);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      router.push('/in-game');
    }
  };

  // Animation styles
  const baseAnimation = (startDeg: string, endDeg: string, duration: number) =>
    withRepeat(
      withSequence(
        withTiming(startDeg, { 
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        }),
        withTiming(endDeg, { 
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        })
      ),
      -1,
      true
    );

  const iconAnimations = {
    marker: useAnimatedStyle(() => ({
      transform: [{ rotate: baseAnimation('-25deg', '-5deg', 2000) }]
    })),
    compass: useAnimatedStyle(() => ({
      transform: [{ rotate: baseAnimation('25deg', '5deg', 2500) }]
    })),
    airplane: useAnimatedStyle(() => ({
      transform: [{ rotate: baseAnimation('55deg', '35deg', 3000) }]
    })),
    map: useAnimatedStyle(() => ({
      transform: [{ rotate: baseAnimation('-20deg', '0deg', 2800) }]
    })),
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorativeContainer}>
        <Animated.View 
          style={[
            styles.decorativeIcon,
            { top: height * 0.15, left: width * 0.1 },
            iconAnimations.marker
          ]}
        >
          <Ionicons 
            name="location" 
            size={90} 
            color={Colors.light.primary}
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.decorativeIcon,
            { top: height * 0.3, right: width * 0.15 },
            iconAnimations.compass
          ]}
        >
          <Ionicons 
            name="compass" 
            size={80} 
            color={Colors.light.accent}
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.decorativeIcon,
            { bottom: height * 0.12, left: width * 0.15 },
            iconAnimations.airplane
          ]}
        >
          <Ionicons 
            name="airplane" 
            size={80} 
            color={Colors.light.primary}
          />
        </Animated.View>

        <Animated.View 
          style={[
            styles.decorativeIcon,
            { bottom: height * 0.2, right: width * 0.1 },
            iconAnimations.map
          ]}
        >
          <Ionicons 
            name="map" 
            size={75} 
            color={Colors.light.accent}
          />
        </Animated.View>
      </View>

      <View style={styles.progressContainer}>
        <ThemedText style={styles.progressText}>
          Question {currentQuestionIndex + 1}/{quizQuestions.length}
        </ThemedText>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.questionContainer}>
        <ThemedText style={styles.questionText}>
          {currentQuestion.question}
        </ThemedText>
        <View style={styles.hintContainer}>
          <MaterialCommunityIcons 
            name="gesture-swipe-horizontal" 
            size={32} 
            color={Colors.light.primary}
          />
          <ThemedText style={styles.hintText}>Swipe left or right to choose</ThemedText>
        </View>
      </View>
      
      <SwipeCard
        optionLeft={currentQuestion.optionLeft}
        optionRight={currentQuestion.optionRight}
        onSwipe={handleSwipe}
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  decorativeIcon: {
    position: 'absolute',
    opacity: 0.10,
    zIndex: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: Colors.light.background,
    position: 'relative',
    zIndex: 1,
  },
  progressContainer: {
    width: '100%',
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.02,
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.light.secondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: height * 0.3,
    paddingVertical: height * 0.05,
  },
  questionText: {
    fontSize: Math.min(width * 0.07, 36),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    lineHeight: Math.min(width * 0.08, 40),
    paddingHorizontal: width * 0.05,
    color: Colors.light.primaryText,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
    opacity: 0.7,
  },
  hintText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.primary,
  },
});
