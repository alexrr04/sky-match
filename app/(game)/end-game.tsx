import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';

export default function EndGameScreen() {
  const { navigateTo } = useNavigate();

  const handleReturnToLobby = () => {
    navigateTo('/lobby');
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Game Over!</ThemedText>

      <View style={styles.results}>
        <ThemedText style={styles.resultText}>Final Score: 1000</ThemedText>
        <ThemedText style={styles.resultText}>Time: 05:00</ThemedText>
      </View>

      <View style={styles.actions}>
        <ThemedText style={styles.actionButton} onPress={handleReturnToLobby}>
          Return to Lobby
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  results: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resultText: {
    fontSize: 24,
    marginVertical: 10,
  },
  actions: {
    marginTop: 20,
  },
  actionButton: {
    fontSize: 18,
    padding: 12,
    backgroundColor: '#34C759',
    color: '#FFFFFF',
    borderRadius: 8,
    minWidth: 150,
    textAlign: 'center',
  },
});
