import { View, StyleSheet, Text } from 'react-native';
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
    navigateTo('/join-group');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo-no-bg.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>FriendTrip</Text>
      <View style={styles.buttonContainer}>
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
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 20,
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
});
