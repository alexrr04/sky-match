import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';
import { GroupMemberCard } from '@/components/GroupMemberCard';



export default function LobbyScreen() {
  const { navigateTo } = useNavigate();

  const handleStartMatch = () => {
    navigateTo('/in-game');
  };

  // 🔽 Participantes de prueba
  const participants = [
    { id: '1', name: 'Sofia', isHost: true },
    { id: '2', name: 'Carlos' },
    { id: '3', name: 'Lucía' },
  ];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Game Lobby</ThemedText>

      <View style={styles.memberList}>
        {participants.map((p) => (
          <GroupMemberCard key={p.id} name={p.name} isHost={p.isHost} />
        ))}
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.subtitle}>
          Players in Lobby: {participants.length}
        </ThemedText>
        <ThemedText style={styles.actionButton} onPress={handleStartMatch}>
          Start Match
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
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
  },
  memberList: {
    width: '100%',
    marginBottom: 20,
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
