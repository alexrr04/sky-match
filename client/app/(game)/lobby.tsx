import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Clipboard } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';
import { GroupMemberCard } from '@/components/GroupMemberCard';
import { FontAwesome6 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
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
      {/* Group Code Section */}
      <View style={styles.groupCodeContainer}>
        <ThemedText style={styles.groupCodeLabel}>Group Code:</ThemedText>
        <ThemedText style={styles.groupCodeValue}>
          {lobbyData.lobbyCode}
        </ThemedText>
        <Pressable style={styles.copyButton} onPress={handleCopyCode}>
          <FontAwesome6 name="copy" size={20} color="#3B82F6" />
        </Pressable>
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
    paddingTop: 80,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  copyButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupCodeLabel: {
    fontSize: 14,
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  groupCodeValue: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E40AF',
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
