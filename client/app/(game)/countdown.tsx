import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigate } from '@/hooks/useNavigate';
import {
  useTripStateAction,
  useTripStateReactive,
} from '@/state/stores/tripState/tripSelector';
import { findBestMatchingDestinations } from '@/scripts/destinationMatcher';
import { socket } from '@/utils/socket';
import { GroupInput, Member, GroupDestination } from '@/constants/types';
import {
  getLobbyStateValue,
  useLobbyStateAction,
} from '@/state/stores/lobbyState/lobbySelector';

const { width, height } = Dimensions.get('window');

interface DestinationResponse {
  success: boolean;
  data: GroupDestination;
}

function convertQuizAnswersToPreferences(
  answers: string[]
): Record<string, boolean> {
  // Map quiz answers to boolean preferences
  return {
    Relax: answers.includes('Relax'),
    Adventure: answers.includes('Adventure'),
    Hot: answers.includes('Hot'),
    Cold: answers.includes('Cold'),
    Beach: answers.includes('Beach'),
    Mountain: answers.includes('Mountain'),
    'Modern City': answers.includes('Modern City'),
    Historic: answers.includes('Historic'),
    Nightlife: answers.includes('party'),
    'Quiet evenings': answers.includes('sleep'),
    'Good food': answers.includes('goodFood'),
  };
}

export default function CountdownScreen() {
  const [count, setCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const { navigateTo } = useNavigate();

  const membersAnswers = useTripStateReactive('membersAnswers');
  const isHost = getLobbyStateValue('isHost');
  const lobbyCode = getLobbyStateValue('lobbyCode');
  const setSelectedDestination = useTripStateAction('setSelectedDestination');
  const setPhase = useLobbyStateAction('setPhase');

  useEffect(() => {
    if (isHost && membersAnswers) {
      // Format data for destination matcher
      const groupInput: GroupInput = {
        members: Object.entries(membersAnswers.phase1Answers).map(
          ([name, data]) => {
            const preferences = convertQuizAnswersToPreferences(
              membersAnswers.quizAnswers[name]
            );
            return {
              name,
              originAirport: data.originAirport,
              budget: data.budget,
              ...preferences,
            } as Member;
          }
        ),
        departureDate: '2024-06-01',
        returnDate: '2024-06-07',
        code: lobbyCode || 'DEFAULT',
      };

      // Compute destination
      findBestMatchingDestinations(groupInput)
        .then((destinations) => {
          if (destinations.length > 0) {
            const bestDestination = destinations[0];
            socket.emit('computedDestination', {
              success: true,
              data: bestDestination,
            });
          }
        })
        .catch((error) => {
          console.error('Error computing destination:', error);
        });
    }

    // Listen for computed destination
    socket.on('destinationComputed', (data: DestinationResponse) => {
      if (data.success) {
        setSelectedDestination(data.data);
        setIsLoading(false);
        setCountdownStarted(true);
        setPhase('countdown');
        startCountdown();
      }
    });

    return () => {
      socket.off('destinationComputed');
    };
  }, [isHost, membersAnswers]);

  const startCountdown = () => {
    // Initial animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Start countdown
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Navigate to end-game after the last animation
          setTimeout(() => {
            setPhase('done');
            navigateTo('/end-game');
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  // Trigger animation on count change
  useEffect(() => {
    if (countdownStarted) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(1);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(700),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [count, countdownStarted]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.loadingText}>
          Computing your perfect destination...
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Get Ready!</ThemedText>
        <ThemedText style={styles.subtitle}>
          Get ready to see your perfect trip...
        </ThemedText>

        <View style={styles.countdownContainer}>
          <Animated.View
            style={[
              styles.numberContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            {count > 0 ? (
              <ThemedText style={styles.number}>{count}</ThemedText>
            ) : (
              <MaterialIcons
                name="flight-takeoff"
                size={64}
                color={Colors.light.primary}
              />
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: Colors.light.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: 16,
    lineHeight: 40,
    includeFontPadding: false,
    padding: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.primary,
    marginBottom: 48,
  },
  countdownContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.05,
  },
  numberContainer: {
    width: 200,
    height: 200,
    borderRadius: 120,
    backgroundColor: Colors.light.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  number: {
    fontSize: 140,
    fontWeight: 'bold',
    color: Colors.light.primary,
    includeFontPadding: false,
    lineHeight: 160,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 160,
  },
});
