import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SwipeCard } from '@/components/SwipeCard';
import { quizQuestions } from '@/constants/QuizQuestions';
import { router } from 'expo-router';
import { useTripStore } from '@/state/stores/tripState/tripState';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import { useImagePreloader } from '@/hooks/useImagePreloader';
export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const imagesLoaded = useImagePreloader(currentQuestionIndex, quizQuestions.length);

  // Animation values
  const marker = useSharedValue(0);
  const compass = useSharedValue(0);
  const airplane = useSharedValue(0);
  const map = useSharedValue(0);
  const earth = useSharedValue(0);

  React.useEffect(() => {
    marker.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 2000 }),
        withTiming(-5, { duration: 2000 })
      ),
      -1,
      true
    );
    
    compass.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 2500 }),
        withTiming(5, { duration: 2500 })
      ),
      -1,
      true
    );

    airplane.value = withRepeat(
      withSequence(
        withTiming(55, { duration: 3000 }),
        withTiming(35, { duration: 3000 })
      ),
      -1,
      true
    );

    map.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 2800 }),
        withTiming(0, { duration: 2800 })
      ),
      -1,
      true
    );

    earth.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2700 }),
        withTiming(10, { duration: 2700 })
      ),
      -1,
      true
    );
  }, []);

  const iconAnimations = {
    marker: useAnimatedStyle(() => ({
      transform: [{ rotate: `${marker.value}deg` }]
    })),
    compass: useAnimatedStyle(() => ({
      transform: [{ rotate: `${compass.value}deg` }]
    })),
    airplane: useAnimatedStyle(() => ({
      transform: [{ rotate: `${airplane.value}deg` }]
    })),
    map: useAnimatedStyle(() => ({
      transform: [{ rotate: `${map.value}deg` }]
    })),
    earth: useAnimatedStyle(() => ({
      transform: [{ rotate: `${earth.value}deg` }]
    })),
  };

  const { addQuizAnswer, transformAndStorePreferences } = useTripStore();

  const handleSwipe = async (direction: 'left' | 'right') => {
    const selectedOption = direction === 'left' ? currentQuestion.optionLeft : currentQuestion.optionRight;
    
    addQuizAnswer({
      questionId: currentQuestion.id,
      choice: direction
    });

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      try {
        console.log('Processing last answer...');
        await transformAndStorePreferences();
        console.log('Preferences transformed, navigating to countdown...');
        setTimeout(() => {
          router.push('/countdown' as any);
        }, 500);
      } catch (error) {
        console.error('Error processing quiz completion:', error);
      }
    }
  };

  if (!imagesLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.loadingText}>Loading next question...</ThemedText>
      </View>
    );
  }

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
            color={Colors.light.accent}
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
            color={Colors.light.primary}
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

        <Animated.View 
          style={[
            styles.decorativeIcon,
            { bottom: height * 0.3, left: width * 0.3 },
            iconAnimations.earth
          ]}
        >
          <Ionicons 
            name="earth" 
            size={70} 
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.primary,
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  decorativeIcon: {
    position: 'absolute',
    opacity: 0.3,
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
