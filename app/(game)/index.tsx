import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';

export default function MainScreen() {
  const { navigateTo } = useNavigate();

  const handleStartGame = () => {
    navigateTo('/lobby');
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Welcome to the Game</ThemedText>
      <ThemedText style={styles.startButton} onPress={handleStartGame}>
        Start Game
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  startButton: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    borderRadius: 8,
  },
});
