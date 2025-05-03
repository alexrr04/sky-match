import { View, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigate } from '@/hooks/useNavigate';
import PrimaryButton from '@/components/PrimaryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { getDestination } from '@/constants/Destinations';
import { Colors } from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

export default function EndGameScreen() {
  const { navigateTo } = useNavigate();
  const backgroundColor = useThemeColor({}, 'background');

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

  const handleReturnToLobby = () => {
    navigateTo('/lobby');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
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
            <ThemedText style={styles.countryName}>
              {destination.country}
            </ThemedText>
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

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={handleReturnToLobby}
            label="Return to Lobby"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.icon,
  },
  destinationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 24,
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  destinationInfo: {
    padding: 16,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 18,
    color: Colors.light.icon,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.icon,
  },
  characteristicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  characteristicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  characteristicText: {
    marginLeft: 8,
    fontSize: 14,
  },
  flightCard: {
    backgroundColor: Colors.light.background,
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
  },
  buttonContainer: {
    marginTop: 24,
  },
});
