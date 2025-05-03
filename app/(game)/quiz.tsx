import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SwipeCard } from '@/components/SwipeCard';
import { quizQuestions } from '@/constants/QuizQuestions';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    // Log user's choice
    console.log(`Question ${currentQuestionIndex + 1}: User chose ${direction === 'left' ? currentQuestion.optionLeft : currentQuestion.optionRight}`);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Navigate to the next screen when all questions are answered
      router.push('/in-game');
    }
  };

  // Reset rotation when question changes
  useEffect(() => {
    // This effect will run whenever the question index changes
    // The SwipeCard component will reset its internal state
  }, [currentQuestionIndex]);

  return (
    <View style={styles.container}>
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
          <MaterialCommunityIcons name="gesture-swipe-horizontal" size={32} color={Colors.light.primary} />
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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    backgroundColor: Colors.light.background,
  },
  progressContainer: {
    width: '100%',
    marginTop: height * 0.02,
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.primary,
  },
  progressBar: {
    height: 6,
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
