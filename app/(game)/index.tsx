import { View, StyleSheet, Text, TextInput } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useNavigate } from '@/hooks/useNavigate';
import { Image } from 'expo-image';
import PrimaryButton from '@/components/PrimaryButton';
import { Button } from '@react-navigation/elements';

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

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-no-bg.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>FriendTrip</Text>
      {showPopup && (
        <View style={styles.popup}>
          <Text style={styles.popupText}>Enter Group Code:</Text>
          <TextInput
            style={styles.input}
            value={groupCode}
            onChangeText={setGroupCode}
            placeholder="Group Code"
          />
          <PrimaryButton 
            label="Confirm" 
            onPress={handleConfirmGroupCode} 
          />
        </View>
      )}
      <View style={[styles.buttonContainer, showPopup && styles.dimmed]}>
        <PrimaryButton 
          label="Create Group" 
          onPress={handleCreateGroup} 
        />
        <PrimaryButton 
          label="Join Group" 
          onPress={handleJoinGroup} 
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
    opacity: 0.5,
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
});
