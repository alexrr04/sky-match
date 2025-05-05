import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { SwipeCard } from '@/components/SwipeCard';
import { quizQuestions } from '@/constants/QuizQuestions';
import { useNavigate } from '@/hooks/useNavigate';
import { ThemedText } from '@/components/ThemedText';
import { socket } from '@/utils/socket';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useLobbyStore } from '@/state/stores/lobbyState/lobbyStore';

interface QuizStatus {
  completed: string[];
  total: number;
  timeStarted: number | null;
}

interface CompiledAnswers {
  success: boolean;
  data: {
    quizAnswers: Record<string, string[]>;
    phase1Answers: Record<
      string,
      {
        originAirport: string;
        budget: number;
        hasLicense: boolean;
      }
    >;
  };
}

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedMembers, setCompletedMembers] = useState<string[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(30); // Initialize with 30
  const [answers, setAnswers] = useState<string[]>([]);
  const setMembersAnswers = useLobbyStore((state) => state.setMembersAnswers);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const imagesLoaded = useImagePreloader(
    currentQuestionIndex,
    quizQuestions.length
  );
  const { navigateTo } = useNavigate();

  // Animation values
  const marker = useSharedValue(0);
  const compass = useSharedValue(0);
  const airplane = useSharedValue(0);
  const map = useSharedValue(0);
  const earth = useSharedValue(0);

  // Define animated styles outside conditionals
  const markerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${marker.value}deg` }],
  }));

  const compassStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${compass.value}deg` }],
  }));

  const airplaneStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${airplane.value}deg` }],
  }));

  const mapStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${map.value}deg` }],
  }));

  const earthStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${earth.value}deg` }],
  }));

  useEffect(() => {
    // Listen for quiz status updates
    socket.on('quizStatus', (data: QuizStatus) => {
      setCompletedMembers(data.completed);
      setTotalMembers(data.total);

      // Start countdown when first person completes
      if (data.timeStarted) {
        const elapsed = Math.floor((Date.now() - data.timeStarted) / 1000);
        const remaining = Math.max(30 - elapsed, 0);
        setTimeLeft(remaining);
      }
    });

    // Host-only: receive all answers when everyone completes
    socket.on('allAnswersCompiled', (data: CompiledAnswers) => {
      if (data.success && data.data) {
        setMembersAnswers(data.data);
      }
    });

    // Listen for time up event
    socket.on('quizTimeUp', () => {
      if (!isSubmitting) {
        handleQuizComplete(true);
      }
    });

    // Listen for navigation event
    socket.on('navigateToCountdown', () => {
      navigateTo('/countdown');
    });

    return () => {
      socket.off('quizStatus');
      socket.off('quizTimeUp');
      socket.off('navigateToCountdown');
      socket.off('allAnswersCompiled');
    };
  }, [isSubmitting]);

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Animation setup
  useEffect(() => {
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

  const handleQuizComplete = (isAutoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Emit submission to server
    socket.emit(
      'submitQuiz',
      { answers },
      (response: { success: boolean; message?: string }) => {
        if (!response.success) {
          console.error('Failed to submit quiz:', response.message);
        }
      }
    );
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const selectedOption =
      direction === 'left'
        ? currentQuestion.optionLeft
        : currentQuestion.optionRight;

    // Store the answer
    setAnswers((prev) => [...prev, selectedOption.label]);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // All questions answered, submit the quiz
      handleQuizComplete();
    }
  };

  if (isSubmitting) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.waitingText}>
          {completedMembers.length} of {totalMembers} members ready
        </ThemedText>
      </View>
    );
  }

  if (!imagesLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.loadingText}>
          Loading next question...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Timer display - Always visible */}
      <View style={styles.timerContainer}>
        <MaterialIcons name="timer" size={24} color={Colors.light.primary} />
        <ThemedText style={styles.timerText}>{timeLeft}s</ThemedText>
      </View>

      <View style={styles.decorativeContainer}>
        <Animated.View
          style={[
            styles.decorativeIcon,
            { top: height * 0.15, left: width * 0.1 },
            markerStyle,
          ]}
        >
          <Ionicons name="location" size={90} color={Colors.light.accent} />
        </Animated.View>

        <Animated.View
          style={[
            styles.decorativeIcon,
            { top: height * 0.3, right: width * 0.15 },
            compassStyle,
          ]}
        >
          <Ionicons name="compass" size={80} color={Colors.light.primary} />
        </Animated.View>

        <Animated.View
          style={[
            styles.decorativeIcon,
            { bottom: height * 0.12, left: width * 0.15 },
            airplaneStyle,
          ]}
        >
          <Ionicons name="airplane" size={80} color={Colors.light.primary} />
        </Animated.View>

        <Animated.View
          style={[
            styles.decorativeIcon,
            { bottom: height * 0.2, right: width * 0.1 },
            mapStyle,
          ]}
        >
          <Ionicons name="map" size={75} color={Colors.light.accent} />
        </Animated.View>

        <Animated.View
          style={[
            styles.decorativeIcon,
            { bottom: height * 0.3, left: width * 0.3 },
            earthStyle,
          ]}
        >
          <Ionicons name="earth" size={70} color={Colors.light.accent} />
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
              {
                width: `${
                  ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                }%`,
              },
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
          <ThemedText style={styles.hintText}>
            Swipe left or right to choose
          </ThemedText>
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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: Colors.light.background,
    position: 'relative',
    zIndex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.primary,
  },
  waitingText: {
    marginTop: 16,
    fontSize: 18,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  timerContainer: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  timerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  timerUrgent: {
    backgroundColor: Colors.light.error + '20',
  },
  timerTextUrgent: {
    color: Colors.light.error,
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
