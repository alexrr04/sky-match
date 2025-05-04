import { View, StyleSheet, FlatList, Pressable, Clipboard, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';
import { GroupMemberCard } from '@/components/GroupMemberCard';
import { FontAwesome6 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LobbyScreen() {
  const { navigateTo } = useNavigate();

  const handleStartMatch = () => {
    navigateTo('/phase1-quiz');
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
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigateTo('/create-group')}
      >
        <MaterialIcons name="arrow-back" size={28} color={Colors.light.primary} />
      </TouchableOpacity>
      {/* Group Code section */}
      <View style={styles.headerSection}>
        <View style={styles.groupCodeContainer}>
          <View style={styles.codeSection}>
            <View>
              <ThemedText style={styles.groupCodeLabel}>Group Code</ThemedText>
              <ThemedText style={styles.groupCodeValue}>{groupCode}</ThemedText>
            </View>
            <Pressable 
              style={styles.copyButton} 
              onPress={handleCopyCode}
            >
              <FontAwesome6 name="copy" size={18} color={Colors.light.primary} />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <FontAwesome6 name="users" size={14} color={Colors.light.primary} />
              <ThemedText style={styles.infoText}>
                {participants.length} Member{participants.length !== 1 ? 's' : ''}
              </ThemedText>
            </View>
          </View>
        </View>
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
    paddingTop: height * 0.1, // Increased padding for more space
    paddingHorizontal: 20,
    position: 'relative',
    backgroundColor: Colors.light.background,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.05,
    zIndex: 1,
    padding: 8,
    backgroundColor: Colors.light.secondary + '20',
    borderRadius: 8,
  },
  headerSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
    marginTop: 0, // Added top margin
  },
  groupCodeContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  codeSection: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupCodeLabel: {
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: 4,
    fontWeight: '600',
  },
  groupCodeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    letterSpacing: 1,
  },
  copyButton: {
    padding: 10,
    backgroundColor: Colors.light.secondary + '20',
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.secondary + '40',
    marginHorizontal: 16,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: 12,
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
    backgroundColor: Colors.light.primary,
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
