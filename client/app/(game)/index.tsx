import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { useNavigate } from '@/hooks/useNavigate';
import { Image } from 'expo-image';
import PrimaryButton from '@/components/PrimaryButton';
import { MaterialIcons } from '@expo/vector-icons';
import { socket } from '@/utils/socket';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  useSharedValue,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

// Background shape components
const FloatingShape = ({ style, size, color, delay = 0 }: any) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(-50, {
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        withTiming(0, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withTiming(360, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1
    );

    scale.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(1.1, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return <AnimatedView style={[styles.shape, { width: size, height: size, backgroundColor: color }, style, animatedStyle]} />;
};

interface JoinLobbyResponse {
  success: boolean;
  lobbyCode?: string;
  message?: string;
}

export default function MainScreen() {
  const { navigateTo } = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);
  const [groupCode, setGroupCode] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [isJoining, setIsJoining] = React.useState(false);

  // Animation values
  const darkBgOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const buttonContainerOpacity = useSharedValue(0);
  const popupScale = useSharedValue(0);

  useEffect(() => {
    // Initial animations with single sequence
    logoScale.value = withSequence(
      withSpring(1, {
        mass: 1,
        damping: 12,
        stiffness: 100,
      }),
      withDelay(
        1000,
        withSequence(
          withTiming(1.05, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        )
      )
    );
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    buttonContainerOpacity.value = withDelay(
      800,
      withTiming(1, { duration: 800 })
    );
  }, []);

  useEffect(() => {
    if (showPopup) {
      popupScale.value = withSpring(1);
      darkBgOpacity.value = withTiming(1, { duration: 300 });
    } else {
      popupScale.value = withTiming(0);
      darkBgOpacity.value = withTiming(0, { duration: 300 });
      // Clear form when closing popup
      setGroupCode('');
      setUserName('');
      setIsJoining(false);
    }
  }, [showPopup]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      { translateY: withTiming(titleOpacity.value * -20, { duration: 800 }) },
    ],
  }));

  const buttonContainerStyle = useAnimatedStyle(() => ({
    opacity: buttonContainerOpacity.value,
    transform: [
      {
        translateY: withTiming(buttonContainerOpacity.value * -20, {
          duration: 800,
        }),
      },
    ],
  }));

  const popupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popupScale.value }],
    opacity: popupScale.value,
  }));

  const darkBgStyle = useAnimatedStyle(() => ({
    opacity: darkBgOpacity.value,
  }));

  const handleCreateGroup = () => {
    navigateTo('/create-group');
  };

  const handleJoinGroup = () => {
    darkBgOpacity.value = withTiming(1, { duration: 300 });
    setShowPopup(true);
  };

  const handleConfirmGroupCode = () => {
    if (!userName.trim() || !groupCode.trim()) {
      Alert.alert('Error', 'Please enter both your name and the group code');
      return;
    }

    setIsJoining(true);
    socket.emit(
      'joinLobby',
      { lobbyCode: groupCode.toUpperCase(), name: userName.trim() },
      (response: JoinLobbyResponse) => {
        setIsJoining(false);
        if (response.success) {
          // Store the lobby code for future use
          socket.emit('storeLobbyCode', { lobbyCode: groupCode.toUpperCase() });
          setShowPopup(false);
          navigateTo('lobby');
        } else {
          Alert.alert(
            'Error',
            response.message || 'Failed to join the group. Please try again.'
          );
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <FloatingShape 
          size={100} 
          color={Colors.light.primary + '10'} 
          style={styles.shape1}
          delay={0}
        />
        <FloatingShape 
          size={80} 
          color={Colors.light.accent + '10'} 
          style={styles.shape2}
          delay={500}
        />
        <FloatingShape 
          size={120} 
          color={Colors.light.secondary + '10'} 
          style={styles.shape3}
          delay={1000}
        />
        <FloatingShape 
          size={60} 
          color={Colors.light.primary + '10'} 
          style={styles.shape4}
          delay={1500}
        />
      </View>

      <Animated.View
        style={[
          styles.overlay,
          darkBgStyle,
        ]}
      />
      
      <AnimatedImage
        source={require('@/assets/images/logo-no-bg.png')}
        style={[styles.logo, logoStyle]}
        contentFit="contain"
      />
      <Animated.Text style={[styles.text, titleStyle]}>SkyMatch</Animated.Text>

      <Animated.View
        style={[styles.popup, popupStyle, showPopup && styles.popupVisible]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowPopup(false)}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.popupTitle}>Join a Group</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color={Colors.light.primary} />
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor={Colors.light.placeholder}
            editable={!isJoining}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="groups" size={24} color={Colors.light.primary} />
          <TextInput
            style={styles.input}
            value={groupCode}
            onChangeText={(text) => setGroupCode(text.toUpperCase())}
            placeholder="Enter group code"
            placeholderTextColor={Colors.light.placeholder}
            autoCapitalize="characters"
            maxLength={6}
            editable={!isJoining}
          />
        </View>

        <PrimaryButton
          label={isJoining ? 'Joining...' : 'Join Group'}
          onPress={handleConfirmGroupCode}
          disabled={!userName || !groupCode || isJoining}
          compact
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          buttonContainerStyle,
        ]}
      >
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
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
    borderRadius: 16,
  },
  shape1: {
    top: '15%',
    left: '10%',
    transform: [{ rotate: '45deg' }],
  },
  shape2: {
    top: '35%',
    right: '15%',
    borderRadius: 40,
  },
  shape3: {
    bottom: '20%',
    left: '20%',
    transform: [{ rotate: '-30deg' }],
  },
  shape4: {
    bottom: '35%',
    right: '25%',
    borderRadius: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    padding: width * 0.05,
  },
  logo: {
    width: Math.min(width * 0.8, 300),
    height: Math.min(width * 0.8, 300),
    marginBottom: -height * 0.06,
    zIndex: 2,
  },
  text: {
    fontSize: Math.min(width * 0.12, 48),
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: height * 0.26,
    zIndex: 2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: height * 0.02,
    paddingHorizontal: width * 0.1,
    zIndex: 2,
  },
  popup: {
    position: 'absolute',
    width: Math.min(width * 0.85, 360),
    backgroundColor: '#fff',
    padding: Math.min(width * 0.05, 25),
    paddingTop: Math.min(width * 0.06, 30),
    borderRadius: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    zIndex: 3,
    backdropFilter: 'blur(10px)',
    transform: [{ scale: 1 }],
  },
  popupVisible: {
    display: 'flex',
  },
  popupTitle: {
    fontSize: Math.min(width * 0.07, 28),
    fontWeight: '800',
    color: Colors.light.primaryText,
    marginBottom: height * 0.035,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: 14,
    marginBottom: height * 0.02,
    padding: Math.min(width * 0.035, 16),
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: width * 0.025,
    fontSize: Math.min(width * 0.04, 16),
    color: Colors.light.primaryText,
    fontWeight: '500',
    height: 40,
  },
  closeButton: {
    position: 'absolute',
    top: -Math.min(width * 0.035, 15),
    right: -Math.min(width * 0.035, 15),
    width: Math.min(width * 0.11, 44),
    height: Math.min(width * 0.11, 44),
    borderRadius: Math.min(width * 0.055, 22),
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    transform: [{ scale: 1 }],
  },
});
