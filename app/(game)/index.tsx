import { View, StyleSheet } from 'react-native';
import { useNavigate } from '@/hooks/useNavigate';
import { Button } from '@react-navigation/elements';

export default function MainScreen() {
  const { navigateTo } = useNavigate();

  const handleStartGame = () => {
    navigateTo('/lobby');
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleStartGame}>Start Game</Button>
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
