import { View, StyleSheet, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';
import { GroupMemberCard } from '@/components/GroupMemberCard';

export default function LobbyScreen() {
  const { navigateTo } = useNavigate();

  const handleStartMatch = () => {
    navigateTo('/in-game');
  };

  const groupCode = 'ABC123';

  const participants = [
    { id: '1', name: 'Sofia', isHost: true },
    { id: '2', name: 'Carlos' },
    { id: '3', name: 'Lucía' },
    

  ];

  return (
    <View style={styles.container}>
      {/* Group Code section */}
      <View style={styles.groupCodeContainer}>
        <ThemedText style={styles.groupCodeLabel}>Group Code:</ThemedText>
        <ThemedText style={styles.groupCodeValue}>{groupCode}</ThemedText>
      </View>

      {/* Members */}
      <ThemedText style={styles.title}>Members</ThemedText>

      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupMemberCard name={item.name} isHost={item.isHost} />
        )}
        contentContainerStyle={styles.memberList}
        showsVerticalScrollIndicator={false}
      />

      {/* Start Button */}
      <View style={styles.footer}>
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  groupCodeContainer: {
    marginBottom: 30,
  },
  groupCodeLabel: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    marginBottom: 4,
  },
  groupCodeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  memberList: {
    paddingBottom: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20, // Subirlo desde el borde inferior
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
