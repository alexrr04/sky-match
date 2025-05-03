import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';

export default function InGameScreen() {
  const { navigateTo } = useNavigate();

  const handleEndGame = () => {
    navigateTo('/end-game');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Game in Progress</ThemedText>
        <ThemedText style={styles.timer}>Time: 00:00</ThemedText>
      </View>

      <View style={styles.gameArea}>
        <ThemedText style={styles.gameText}>Game Content Here</ThemedText>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.actionButton} onPress={handleEndGame}>
          End Game
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
  },
  timer: {
    fontSize: 18,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 20,
  },
  gameText: {
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  actionButton: {
    fontSize: 18,
    padding: 12,
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
    borderRadius: 8,
    minWidth: 150,
    textAlign: 'center',
  },
});
