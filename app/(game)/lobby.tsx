import { View, StyleSheet } from 'react-native';
import { useNavigate } from '@/hooks/useNavigate';
import { Button } from '@react-navigation/elements';

export default function LobbyScreen() {
  const { navigateTo } = useNavigate();

  const handleStartMatch = () => {
    navigateTo('/in-game');
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleStartMatch}>Start Match</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  actionButton: {
    fontSize: 18,
    padding: 12,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    borderRadius: 8,
    minWidth: 150,
    textAlign: 'center',
  },
});
