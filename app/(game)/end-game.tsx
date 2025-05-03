import { View, StyleSheet } from 'react-native';
import { useNavigate } from '@/hooks/useNavigate';
import { Button } from '@react-navigation/elements';

export default function EndGameScreen() {
  const { navigateTo } = useNavigate();

  const handleReturnToLobby = () => {
    navigateTo('/lobby');
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleReturnToLobby}>Return to Lobby</Button>
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
