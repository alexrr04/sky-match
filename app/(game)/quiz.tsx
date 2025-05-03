import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SwipeCard } from '@/components/SwipeCard';
import { quizQuestions } from '@/constants/QuizQuestions';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

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
      <View style={styles.questionContainer}>
        <ThemedText style={styles.questionText}>
          {currentQuestion.question}
        </ThemedText>
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
    backgroundColor: '#f5f5f5',
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
    fontSize: Math.min(width * 0.06, 32),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    lineHeight: Math.min(width * 0.08, 40),
    paddingHorizontal: width * 0.05,
  },
});
