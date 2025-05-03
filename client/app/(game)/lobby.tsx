import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Clipboard,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';
import { GroupMemberCard } from '@/components/GroupMemberCard';
import { FontAwesome6 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { socket } from '@/utils/socket';

// Define a TypeScript interface for a participant
interface Participant {
  id: string;
  name: string;
  isHost?: boolean;
}

interface LobbyData {
  lobbyCode: string;
  members: Participant[];
}

const { width, height } = Dimensions.get('window');

export default function LobbyScreen() {
  const { navigateTo } = useNavigate();
  const [lobbyData, setLobbyData] = useState<LobbyData | null>(null);

  useEffect(() => {
    // Listen for lobby data updates
    const handleLobbyData = (data: LobbyData) => {
      console.log('Received lobby data:', data);
      setLobbyData(data);
    };

    socket.on('lobbyData', handleLobbyData);

    // Request the lobby data using our socket connection
    // The server knows our socket.id and associated lobby
    console.log('Requesting lobby state with socket:', socket.id);
    socket.emit('getLobbyState', (response: any) => {
      console.log('Got lobby state response:', response);
      if (response.success === false) {
        console.error('Failed to get lobby state:', response.message);
      } else {
        setLobbyData(response);
      }
    });

    return () => {
      socket.off('lobbyData', handleLobbyData);
    };
  }, []);

  const handleCopyCode = () => {
    if (lobbyData?.lobbyCode) {
      Clipboard.setString(lobbyData.lobbyCode);
    }
  };

  const handleStartMatch = () => {
    navigateTo('/phase1-quiz');
  };

  // Show loading state while we wait for lobby data
  if (!lobbyData) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading lobby...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigateTo('/create-group')}
      >
        <MaterialIcons
          name="arrow-back"
          size={28}
          color={Colors.light.primary}
        />
      </TouchableOpacity>
      {/* Group Code section */}
      <View style={styles.headerSection}>
        <View style={styles.groupCodeContainer}>
          <View style={styles.codeSection}>
            <View>
              <ThemedText style={styles.groupCodeLabel}>Group Code</ThemedText>
              <ThemedText style={styles.groupCodeValue}>
                {lobbyData?.lobbyCode}
              </ThemedText>
            </View>
            <Pressable style={styles.copyButton} onPress={handleCopyCode}>
              <FontAwesome6
                name="copy"
                size={18}
                color={Colors.light.primary}
              />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <FontAwesome6
                name="users"
                size={14}
                color={Colors.light.primary}
              />
              <ThemedText style={styles.infoText}>
                {participants.length} Member
                {participants.length !== 1 ? 's' : ''}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Members List */}
      <ThemedText style={styles.title}>Members</ThemedText>
      <FlatList
        data={lobbyData.members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupMemberCard name={item.name} isHost={item.isHost} />
        )}
        contentContainerStyle={styles.memberList}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer with Start Button */}
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
    backgroundColor: Colors.light.background,
    position: 'relative',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.light.primaryText,
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
    textAlign: 'center',
    color: '#1E40AF', // Dark blue
    letterSpacing: 1.5,
    paddingVertical: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: 12,
  },
  memberList: {
    paddingBottom: 100,
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
    borderTopColor: '#E2E8F0',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
