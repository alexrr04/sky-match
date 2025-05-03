import { View, StyleSheet, FlatList, Pressable, Clipboard } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';
import { GroupMemberCard } from '@/components/GroupMemberCard';
import { FontAwesome6 } from '@expo/vector-icons';

export default function LobbyScreen() {
  const { navigateTo } = useNavigate();

  const handleStartMatch = () => {
    navigateTo('/in-game');
  };

  const groupCode = 'ABC123';

  const handleCopyCode = () => {
    Clipboard.setString(groupCode);
  };

  const participants = [
    { id: '1', name: 'Sofia', isHost: true },
    { id: '2', name: 'Carlos' },
    { id: '3', name: 'Lucía' },
    { id: '4', name: 'Mateo' },
    { id: '5', name: 'Valentina' },
    { id: '6', name: 'Diego' },
    { id: '7', name: 'Camila' },
    { id: '8', name: 'Andrés' },
    { id: '9', name: 'Isabella' },
    { id: '10', name: 'Sebastián' },
  ];

  return (
    <View style={styles.container}>
      {/* Group Code section */}
      <View style={styles.groupCodeContainer}>
        <ThemedText style={styles.groupCodeLabel}>Group Code:</ThemedText>
        <ThemedText style={styles.groupCodeValue}>{groupCode}</ThemedText>
        <Pressable style={styles.copyButton} onPress={handleCopyCode}>
          <FontAwesome6 name="copy" size={20} color="#3B82F6" />
        </Pressable>
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
    paddingTop: 80,
    paddingHorizontal: 20,
    position: 'relative',
    backgroundColor: '#F8FAFC', // Light grey-blue background
  },
  groupCodeContainer: {
    marginBottom: 30,
    backgroundColor: '#EFF6FF',
    padding: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: -20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#60A5FA',
    position: 'relative',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  copyButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#60A5FA',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupCodeLabel: {
    fontSize: 16,
    color: '#3B82F6', // Bright blue
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  groupCodeValue: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E40AF', // Dark blue
    letterSpacing: 1.5,
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B', // Dark grey-blue
    marginBottom: 16,
  },
  memberList: {
    paddingBottom: 100, // Space for the fixed button
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0', // Light grey-blue border
    alignItems: 'center',
  },
  actionButton: {
    fontSize: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#2563EB', // Rich blue
    color: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    shadowColor: '#1E40AF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
