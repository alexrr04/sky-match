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
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
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
  host: string; // This is the socket.id of the host
}

interface LobbyResponse extends LobbyData {
  success: boolean;
  message?: string;
}

const { width, height } = Dimensions.get('window');

export default function LobbyScreen() {
  const { navigateTo } = useNavigate();
  const [lobbyData, setLobbyData] = useState<LobbyData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [lobbyCode, setLobbyCode] = useState('');

  useEffect(() => {
    // Listen for lobby data updates
    const handleLobbyData = (data: LobbyData) => {
      console.log('Received lobby data:', data);
      setLobbyData(data);
      setLobbyCode(data.lobbyCode);
      setParticipants(data.members);

      // Simply compare the current socket.id with the host id from the server
      const currentSocket = socket.id;
      setIsHost(data.host === currentSocket);
      console.log('Host check:', {
        currentSocket,
        hostId: data.host,
        isHost: data.host === currentSocket,
      });
    };

    socket.on('lobbyData', handleLobbyData);

    // Request the lobby data using our socket connection
    console.log('Requesting lobby state with socket:', socket.id);
    socket.emit('getLobbyState', (response: LobbyResponse) => {
      console.log('Got lobby state response:', response);
      if (response.success === false) {
        console.error('Failed to get lobby state:', response.message);
      } else {
        setLobbyData(response);
        setParticipants(response.members);

        // Same host check for initial state
        const currentSocket = socket.id;
        setIsHost(response.host === currentSocket);
        console.log('Initial host check:', {
          currentSocket,
          hostId: response.host,
          isHost: response.host === currentSocket,
        });
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
    if (isHost) {
      navigateTo('/phase1-quiz');
    }
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
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupMemberCard
            name={item.name}
            isHost={item.id === lobbyData.host}
          />
        )}
        contentContainerStyle={styles.memberList}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer with Start Button */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.actionButtonContainer,
            !isHost && styles.actionButtonDisabled,
          ]}
          onPress={handleStartMatch}
          disabled={!isHost}
        >
          <ThemedText
            style={[
              styles.actionButtonText,
              !isHost && styles.actionButtonTextDisabled,
            ]}
          >
            {isHost ? 'Start Match' : 'Waiting for Host'}
          </ThemedText>
          {!isHost && (
            <MaterialIcons
              name="lock"
              size={20}
              color={Colors.light.disabled}
              style={styles.lockIcon}
            />
          )}
        </Pressable>
        {!isHost && (
          <ThemedText style={styles.helperText}>
            Only the host can start the match
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.1,
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
    marginTop: 0,
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
  actionButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.light.secondary + '40',
    elevation: 0,
    shadowOpacity: 0,
  },
  actionButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionButtonTextDisabled: {
    color: Colors.light.disabled,
  },
  lockIcon: {
    marginLeft: 8,
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.light.disabled,
    textAlign: 'center',
  },
});
