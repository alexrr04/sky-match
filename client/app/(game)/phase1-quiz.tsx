import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '@/components/PrimaryButton';
import { useNavigate } from '@/hooks/useNavigate';
import { socket } from '@/utils/socket';
import { useTripStateAction } from '@/state/stores/tripState/tripSelector';

interface Phase1Answer {
  originAirport: string;
  budget: number;
  hasLicense: boolean;
}

interface Phase1Response {
  success: boolean;
  message?: string;
  completed: number;
  total: number;
}

interface Phase1Status {
  lobbyCode: string;
  completed: string[];
  total: number;
}

interface TimeUpEvent {
  success: boolean;
  timestamp: number;
}

const { width, height } = Dimensions.get('window');

const QUIZ_DURATION = 25; // seconds

export default function Phase1Quiz() {
  const [originAirport, setOriginAirport] = useState('');
  const [budget, setBudget] = useState('');
  const [hasLicense, setHasLicense] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedMembers, setCompletedMembers] = useState<string[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);

  const { navigateTo } = useNavigate();

  useEffect(() => {
    // Set up timer for auto-submit
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isSubmitting) {
            handleSubmit(true); // Auto-submit when time is up
          }
        }
        return prev - 1;
      });
    }, 1000);

    // Listen for quiz status updates
    socket.on('phase1Status', (data: Phase1Status) => {
      setCompletedMembers(data.completed);
      setTotalMembers(data.total);
    });

    // Listen for time up event
    socket.on('phase1TimeUp', (data: TimeUpEvent) => {
      if (!isSubmitting) {
        handleSubmit(true);
      }
    });

    // Listen for navigation event
    socket.on('navigateToQuiz', () => {
      navigateTo('/quiz');
    });

    return () => {
      clearInterval(timer);
      socket.off('phase1Status');
      socket.off('phase1TimeUp');
      socket.off('navigateToQuiz');
    };
  }, [isSubmitting]);

  const handleSubmit = (isAutoSubmit = false) => {
    if (isSubmitting) return;

    if (!isAutoSubmit && !isFormValid) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Emit submission to server
    socket.emit(
      'submitPhase1',
      {
        answers: {
          originAirport: originAirport.trim().toUpperCase(),
          budget: parseInt(budget) || 0,
          hasLicense,
        },
      },
      (response: Phase1Response) => {
        if (!response.success) {
          Alert.alert('Error', response.message || 'Failed to submit answers');
          setIsSubmitting(false);
        }
      }
    );
  };

  const isFormValid = originAirport.trim() !== '' && budget.trim() !== '';

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View
        style={[styles.timerContainer, timeLeft <= 5 && styles.timerUrgent]}
      >
        <MaterialIcons
          name="timer"
          size={24}
          color={timeLeft <= 5 ? Colors.light.error : Colors.light.primary}
        />
        <Text
          style={[styles.timerText, timeLeft <= 5 && styles.timerTextUrgent]}
        >
          {timeLeft}s
        </Text>
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Travel Preferences</Text>

          {/* Origin Airport Input */}
          <View style={styles.formGroup}>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="flight-takeoff"
                size={24}
                color={Colors.light.primary}
              />
              <TextInput
                style={styles.input}
                placeholder="Origin Airport (e.g., BCN)"
                placeholderTextColor={Colors.light.placeholder}
                value={originAirport}
                onChangeText={setOriginAirport}
                autoCapitalize="characters"
                maxLength={3}
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* Budget Input */}
          <View style={styles.formGroup}>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="euro"
                size={24}
                color={Colors.light.primary}
              />
              <TextInput
                style={styles.input}
                placeholder="Budget in EUR"
                placeholderTextColor={Colors.light.placeholder}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* License Toggle */}
          <View style={styles.formGroup}>
            <View style={styles.licenseContainer}>
              <View style={styles.licenseContent}>
                <View style={styles.licenseTextContainer}>
                  <MaterialIcons
                    name="directions-car"
                    size={24}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.licenseText}>
                    Do you have a driving license?
                  </Text>
                </View>
                <View style={styles.switchContainer}>
                  <Switch
                    value={hasLicense}
                    onValueChange={setHasLicense}
                    trackColor={{
                      false: Colors.light.disabled,
                      true: Colors.light.secondary,
                    }}
                    thumbColor={
                      hasLicense
                        ? Colors.light.primary
                        : Colors.light.placeholder
                    }
                    disabled={isSubmitting}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Progress indicator */}
          {isSubmitting && (
            <Text style={styles.progressText}>
              {completedMembers.length} of {totalMembers} members ready
            </Text>
          )}
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          label={isSubmitting ? 'Waiting for others...' : 'Submit'}
          onPress={() => handleSubmit()}
          disabled={!isFormValid || isSubmitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: width * 0.85,
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: width * 0.03,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  licenseContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  licenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
  },
  licenseTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  licenseText: {
    marginLeft: width * 0.03,
    fontSize: 16,
    color: Colors.light.primaryText,
    flexShrink: 1,
  },
  switchContainer: {
    marginLeft: width * 0.03,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: width * 0.08,
    paddingBottom: width * 0.08,
    backgroundColor: Colors.light.background,
  },
  progressText: {
    textAlign: 'center',
    marginTop: height * 0.02,
    fontSize: 14,
    color: Colors.light.primary,
  },
});
