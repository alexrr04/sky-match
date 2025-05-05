import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/PrimaryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import airportsWithAttributes from '@/constants/airports_with_attributes.json';
import { AirportAttributes } from '@/constants/types';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigate } from '@/hooks/useNavigate';
import { useTripStateAction } from '@/state/stores/tripState/tripSelector';

const { width, height } = Dimensions.get('window');

export default function EndGameScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const confettiRef = useRef<ConfettiCannon>(null);
  const { navigateTo } = useNavigate();

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
    transform: [{ scale: scale.value }],
  }));

  const getSelectedDestination = useTripStateAction('getSelectedDestination');
  const getDestinationImage = useTripStateAction('getDestinationImage');

  const handleReturnHome = () => {
    navigateTo('/(game)' as any);
  };

  const destination = getSelectedDestination();

  if (!destination) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.light.background }]}
        edges={['top']}
      >
        <View style={[styles.contentContainer, styles.noDestinationContainer]}>
          <View style={styles.noDestinationContent}>
            <MaterialIcons
              name="search-off"
              size={80}
              color={Colors.light.primary}
              style={styles.noDestinationIcon}
            />
            <ThemedText style={[styles.congratsText, styles.noDestinationText]}>
              No Perfect Match Found
            </ThemedText>
            <ThemedText style={styles.noDestinationSubtext}>
              We couldn&apos;t find a destination that matches all your
              group&apos;s preferences. Try adjusting your criteria and try
              again.
            </ThemedText>
          </View>
          <View style={styles.bottomButton}>
            <PrimaryButton onPress={handleReturnHome} label="Return Home" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const iata = destination.destination.split(' (')[1].replace(')', '');
  const destinationName = destination.destination.split(' (')[0];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.light.background }]}
      edges={['top']}
    >
      {/* Confetti overlay */}
      <View style={styles.confettiContainer}>
        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: width / 2, y: -50 }}
          autoStart={false}
          fadeOut={true}
          fallSpeed={2000}
          explosionSpeed={350}
          colors={[
            Colors.light.primary,
            Colors.light.accent,
            Colors.light.secondary,
          ]}
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
            {getDestinationImage() && (
              <Image
                source={{ uri: getDestinationImage()! }}
                style={styles.destinationImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.destinationInfo}>
              <ThemedText style={styles.cityName}>{destinationName}</ThemedText>
              <View style={styles.countryContainer}>
                <ThemedText style={styles.countryName}>
                  {
                    (airportsWithAttributes as AirportAttributes[]).find(
                      (a) => a.iata === iata
                    )?.country
                  }
                </ThemedText>
                <TouchableOpacity onPress={handleDownload}>
                  <Animated.View style={downloadButtonStyle}>
                    <MaterialIcons
                      name="file-download"
                      size={20}
                      color={Colors.light.primary}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText style={styles.description}>
              Total Group Cost: €{destination.totalGroupCost}
            </ThemedText>
          </View>

          {/* Characteristics */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Highlights</ThemedText>
            <View style={styles.characteristicsContainer}>
              {Object.entries(destination.matchDetails)
                .sort((a, b) => b[1].score - a[1].score)
                .map(
                  ([attr, detail], index) =>
                    detail.matches.length > 0 && (
                      <View key={index} style={styles.characteristicItem}>
                        <FontAwesome5
                          name="check-circle"
                          size={16}
                          color={Colors.light.primary}
                        />
                        <ThemedText style={styles.characteristicText}>
                          {attr}
                        </ThemedText>
                      </View>
                    )
                )}
            </View>
          </View>

          {/* Flight Info */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Flight Information
            </ThemedText>
            <View style={styles.flightCard}>
              {Object.entries(destination.memberFlights).map(
                ([memberName, flights], index) => (
                  <View key={index}>
                    <ThemedText style={styles.flightHeader}>
                      {memberName} ({flights.origin} → {iata})
                    </ThemedText>
                    <View style={styles.flightDetail}>
                      <FontAwesome5
                        name="plane"
                        size={16}
                        color={Colors.light.primary}
                      />
                      <ThemedText style={styles.flightText}>
                        Outbound: {flights.outboundFlight.airline} - €
                        {flights.outboundFlight.price}
                        {flights.outboundFlight.isDirect
                          ? ' (direct)'
                          : ' (with stops)'}
                      </ThemedText>
                    </View>
                    <View style={styles.flightDetail}>
                      <FontAwesome5
                        name="plane"
                        size={16}
                        color={Colors.light.primary}
                        style={{ transform: [{ rotate: '180deg' }] }}
                      />
                      <ThemedText style={styles.flightText}>
                        Return: {flights.returnFlight.airline} - €
                        {flights.returnFlight.price}
                        {flights.returnFlight.isDirect
                          ? ' (direct)'
                          : ' (with stops)'}
                      </ThemedText>
                    </View>
                  </View>
                )
              )}
            </View>
          </View>

          <View style={styles.returnButtonContainer}>
            <PrimaryButton onPress={handleReturnHome} label="Return Home" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  noDestinationContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  noDestinationContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1,
  },
  noDestinationIcon: {
    marginBottom: height * 0.03,
    opacity: 0.9,
  },
  noDestinationText: {
    color: Colors.light.primary,
    marginBottom: height * 0.02,
  },
  noDestinationSubtext: {
    fontSize: 16,
    color: Colors.light.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomButton: {
    width: '100%',
    paddingHorizontal: width * 0.1,
    marginBottom: height * 0.05,
  },
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
  flightHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
    marginTop: 12,
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
