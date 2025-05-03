import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigate } from '@/hooks/useNavigate';
import PrimaryButton from '@/components/PrimaryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { getDestination } from '@/constants/Destinations';
import { Colors } from '@/constants/Colors';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

export default function EndGameScreen() {
  const { navigateTo } = useNavigate();
  const backgroundColor = useThemeColor({}, 'background');
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    // Shoot confetti when the screen appears
    setTimeout(() => {
      confettiRef.current?.start();
    }, 100);
  }, []);
  
  // Animation for download button
  const scale = useSharedValue(1);
  
  const handleDownload = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    // TODO: Implement PDF generation and download
  };
  
  const downloadButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  // TODO: Get actual preferences from state once implemented
  const demoPreferences = {
    weather: 'hot' as const,
    setting: 'beach' as const,
    activity: 'relax' as const,
    environment: 'historic' as const,
    food: 'yes' as const,
    lifestyle: 'sleep' as const
  };

  const destination = getDestination(demoPreferences);

  const handleReturnHome= () => {
    navigateTo('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.light.background }]} edges={['top']}>
      {/* Confetti overlay */}
      <View style={styles.confettiContainer}>
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{x: width/2, y: -50}}
          autoStart={false}
          fadeOut={true}
          fallSpeed={2000}
          explosionSpeed={350}
          colors={[Colors.light.primary, Colors.light.accent, Colors.light.secondary]}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.congratsText}>
              🎉 Perfect Match Found!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Based on your group&apos;s preferences, we recommend...
            </ThemedText>
          </View>

          {/* Destination Card */}
          <View style={styles.destinationCard}>
            <Image
              source={{ uri: destination.imageUrl }}
              style={styles.destinationImage}
            />
            <View style={styles.destinationInfo}>
              <ThemedText style={styles.cityName}>
                {destination.city}
              </ThemedText>
              <View style={styles.countryContainer}>
                <ThemedText style={styles.countryName}>
                  {destination.country}
                </ThemedText>
                <TouchableOpacity onPress={handleDownload}>
                  <Animated.View style={downloadButtonStyle}>
                    <MaterialIcons name="file-download" size={20} color={Colors.light.primary} />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText style={styles.description}>
              {destination.description}
            </ThemedText>
          </View>

          {/* Characteristics */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Highlights</ThemedText>
            <View style={styles.characteristicsContainer}>
              {destination.characteristics.map((char, index) => (
                <View key={index} style={styles.characteristicItem}>
                  <FontAwesome5 name="check-circle" size={16} color={Colors.light.primary} />
                  <ThemedText style={styles.characteristicText}>{char}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Flight Info */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Flight Information</ThemedText>
            <View style={styles.flightCard}>
              <View style={styles.flightDetail}>
                <FontAwesome5 name="plane" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.flightText}>
                  {destination.flight.airline}
                </ThemedText>
              </View>
              <View style={styles.flightDetail}>
                <FontAwesome5 name="clock" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.flightText}>
                  {destination.flight.duration}
                </ThemedText>
              </View>
              <View style={styles.flightDetail}>
                <FontAwesome5 name="euro-sign" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.flightText}>
                  {destination.flight.price}
                </ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.returnButtonContainer}>
            <PrimaryButton
              onPress={handleReturnHome}
              label="Return Home"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    pointerEvents: 'none',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.05,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
  },
  congratsText: {
    fontSize: Math.min(width * 0.07, 36),
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: Colors.light.primaryText,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.primary,
  },
  destinationCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.light.secondary + '20',
    shadowColor: Colors.light.primaryText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: height * 0.03,
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  destinationInfo: {
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.light.primaryText,
  },
  countryName: {
    fontSize: 18,
    color: Colors.light.primary,
  },
  section: {
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primaryText,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.primary,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  characteristicText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.primary,
  },
  flightCard: {
    backgroundColor: Colors.light.secondary + '20',
    padding: 16,
    borderRadius: 12,
  },
  flightDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  returnButtonContainer: {
    marginTop: height * 0.03,
    marginBottom: height * 0.05,
  },
});
