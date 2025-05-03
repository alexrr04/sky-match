import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useNavigate } from '@/hooks/useNavigate';
import { Image } from 'expo-image';
import PrimaryButton from '@/components/PrimaryButton';



export default function MainScreen() {
  const { navigateTo } = useNavigate();

  const handleStartGame = () => {
    navigateTo('/lobby');
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
          onPress={() => console.log('Create')} 
        />
        <PrimaryButton 
          label="Join Group" 
          onPress={() => console.log('Join')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: Colors.dark.background,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
    marginTop: 30,
  },
  button: {
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
