import { View, StyleSheet, Text } from 'react-native';
import { useNavigate } from '@/hooks/useNavigate';
import { Button } from '@react-navigation/elements';
import { PlayerAvatar } from '@/components/PlayerAvatar';

// Mock data for testing
const MOCK_PLAYERS = [
  { id: '1', name: 'Alex' },
  { id: '2', name: 'Maria' },
  { id: '3', name: 'John' },
  { id: '4', name: 'Sarah' },
  { id: '5', name: 'Mike' },
];

export default function InGameScreen() {
  const { navigateTo } = useNavigate();

  const handleEndGame = () => {
    navigateTo('/end-game');
  };

  return (
    <View style={styles.container}>
      {/* Players Plaza - Background */}
      <View style={styles.plazaContainer}>
        {MOCK_PLAYERS.map((player, index) => (
          <PlayerAvatar
            key={player.id}
            name={player.name}
            index={index}
            totalPlayers={MOCK_PLAYERS.length}
          />
        ))}
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Decision Component Area - Placeholder */}
        <View style={styles.decisionArea}>
          <Text style={styles.placeholderText}>Decision Component</Text>
        </View>

        {/* Game Area - Placeholder */}
        <View style={styles.gameArea}>
          <Text style={styles.placeholderText}>Game Content</Text>
        </View>

        <Button onPress={handleEndGame}>End Game</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  decisionArea: {
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gameArea: {
    zIndex: 1,
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  plazaContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
});
