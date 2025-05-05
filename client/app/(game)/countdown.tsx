import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigate } from '@/hooks/useNavigate';

const { width, height } = Dimensions.get('window');

export default function CountdownScreen() {
  const [count, setCount] = useState(3);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const { navigateTo } = useNavigate();

  useEffect(() => {
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
            navigateTo('/end-game' as any);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Trigger animation on count change
  useEffect(() => {
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
  }, [count]);

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
