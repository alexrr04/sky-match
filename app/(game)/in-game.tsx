import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

import { useNavigate } from '@/hooks/useNavigate';
import { useTripStateReactive } from '@/state/stores/tripState/tripSelector';
import ProgressBar from '@/components/ProgressBar';
import Phase1Component from '@/components/Phase1Component';
import Phase2Component from '@/components/Phase2Component';

const InGameScreen = () => {
  // Get state values using selector hooks
  const phase = useTripStateReactive('phase');
  const progress = useTripStateReactive('progress');

  // Custom navigator
  const { navigateTo } = useNavigate();

  // Navigate to EndScreen when all questions are answered
  useEffect(() => {
    if (progress >= 1) {
      navigateTo('end-game');
    }
  }, [progress, navigateTo]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top progress bar placeholder */}
      <View style={styles.progressBarContainer}>
        {/* Progress bar component */}
        <ProgressBar progress={progress} />
      </View>

      {/* Main content area: render phase components */}
      <View style={styles.phaseContainer}>
        {phase === 1 && <Phase1Component />}
        {phase === 2 && <Phase2Component />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  progressBarContainer: {
    marginTop: 60,
  },
  phaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default InGameScreen;
