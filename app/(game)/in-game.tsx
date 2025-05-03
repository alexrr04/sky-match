import { View, StyleSheet, Text } from 'react-native';
import { useNavigate } from '@/hooks/useNavigate';
import { Button } from '@react-navigation/elements';
import { PlayerAvatar } from '@/components/PlayerAvatar';
import { useLobbyStore } from '@/state/stores/lobbyStore';

// Mock data for testing
const MOCK_PLAYERS = [
  { id: '1', name: 'Alex' },
  { id: '2', name: 'Maria' },
  { id: '3', name: 'John' },
  { id: '4', name: 'Sophia' },
  { id: '5', name: 'Michael' },
  { id: '6', name: 'Emma' },
  { id: '7', name: 'Liam' },
  { id: '8', name: 'Olivia' },
  { id: '9', name: 'Noah' },
  { id: '10', name: 'Ava' },
];

export default function InGameScreen() {
  const { navigateTo } = useNavigate();
  const playersNames = useLobbyStore((state) => state.playersNames);

  // Combine mock and state players
  const allPlayers = [
    ...MOCK_PLAYERS,
    ...playersNames.map((name, idx) => ({
      id: `state-${idx}`,
      name,
    })),
  ];

  const handleEndGame = () => {
    navigateTo('/end-game');
  };

  return (
    <View style={styles.container}>
      {/* Players Plaza - Background */}
      <View style={styles.plazaContainer}>
        {allPlayers.map((player, index) => (
          <PlayerAvatar
            key={player.id}
            name={player.name}
            index={index}
            totalPlayers={allPlayers.length}
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
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 0,
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
    flex: 1,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  },
});
