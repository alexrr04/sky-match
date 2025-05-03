import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useNavigate } from '@/hooks/useNavigate';
import { Image } from 'expo-image';
import PrimaryButton from '@/components/PrimaryButton';

export default function MainScreen() {
  const { navigateTo } = useNavigate();

  const handleCreateGroup = () => {
    navigateTo('/create-group');
  };

  const handleJoinGroup = () => {
    setShowPopup(true);
  };

  const handleConfirmGroupCode = () => {
    navigateTo('/lobby');
  };

  const [showPopup, setShowPopup] = React.useState(false);
  const [groupCode, setGroupCode] = React.useState('');
  const [userName, setUserName] = React.useState('');

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-no-bg.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>SkyMatch</Text>
      {showPopup && (
        <View style={styles.popup}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPopup(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.popupText}>Enter your name:</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Name"
            placeholderTextColor={Colors.light.placeholder}
          />
          <Text style={styles.popupText}>Enter Group Code:</Text>
          <TextInput
            style={styles.input}
            value={groupCode}
            onChangeText={setGroupCode}
            placeholder="Group Code"
            placeholderTextColor={Colors.light.placeholder}
          />
          <PrimaryButton label="Confirm" onPress={handleConfirmGroupCode} />
        </View>
      )}
      <View style={[styles.buttonContainer, showPopup && styles.dimmed]}>
        <PrimaryButton
          label="Create Group"
          onPress={handleCreateGroup}
          disabled={showPopup}
        />
        <PrimaryButton
          label="Join Group"
          onPress={handleJoinGroup}
          disabled={showPopup}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    padding: 20,
  },
  dimmed: {
    opacity: 0.05,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  popup: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  popupText: {
    fontSize: 18,
    marginBottom: 10,
    color: Colors.light.primaryText,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: Colors.light.primary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  startButton: {
    fontSize: 18,
    padding: 10,
    backgroundColor: Colors.light.primary,
    color: '#FFFFFF',
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
