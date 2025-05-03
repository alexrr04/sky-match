import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';
import { useNavigate } from '@/hooks/useNavigate';
import { socket } from '@/utils/socket';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const { navigateTo } = useNavigate();

  // Animation values
  const iconRotate = useSharedValue(0);

  React.useEffect(() => {
    // Rotate icon animation
    iconRotate.value = withRepeat(withSequence(withSpring(360)), -1, true);
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotate.value}deg` }],
  }));

  const onDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      const dateString = day.dateString;
      setStartDate(dateString);
      setEndDate('');
      setMarkedDates({
        [dateString]: {
          startingDay: true,
          color: Colors.light.primary,
          textColor: Colors.light.buttonText,
          selected: true,
        },
      });
    } else {
      // Complete the selection
      const dateString = day.dateString;
      if (dateString < startDate) {
        setEndDate(startDate);
        setStartDate(dateString);
      } else {
        setEndDate(dateString);
      }

      // Mark the range
      const range: MarkedDates = {};
      let currentDate = new Date(startDate);
      const endDateObj = new Date(dateString);
      while (currentDate <= endDateObj) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (dateStr === startDate) {
          range[dateStr] = {
            startingDay: true,
            color: Colors.light.primary,
            textColor: Colors.light.buttonText,
            selected: true,
          };
        } else if (dateStr === dateString) {
          range[dateStr] = {
            endingDay: true,
            color: Colors.light.primary,
            textColor: Colors.light.buttonText,
            selected: true,
          };
        } else {
          range[dateStr] = {
            color: Colors.light.primary,
            textColor: Colors.light.buttonText,
            selected: true,
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setMarkedDates(range);
    }
  };

  const handleCreate = () => {
    if (name.trim() && startDate && endDate) {
      // Emit socket event to create the lobby
      console.log('Creating lobby with name:', name);
      socket.emit(
        'createLobby',
        { name, startDate, endDate },
        (response: any) => {
          if (response && response.lobbyCode) {
            console.log('Lobby created with code:', response.lobbyCode);
            // Store the lobby code for future use
            socket.emit('storeLobbyCode', { lobbyCode: response.lobbyCode });
            navigateTo('lobby');
          } else {
            console.error('Failed to create lobby', response);
          }
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateTo('/', 'replace')}
        >
          <MaterialIcons
            name="arrow-back"
            size={28}
            color={Colors.light.primary}
          />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Trip Group</Text>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <MaterialIcons
              name="group-add"
              size={36}
              color={Colors.light.primary}
            />
          </Animated.View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Name</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="person"
              size={24}
              color={Colors.light.primary}
            />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.light.placeholder}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select trip dates</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              minDate={new Date().toISOString().split('T')[0]}
              markingType={'period'}
              theme={{
                calendarBackground: '#fff',
                selectedDayBackgroundColor: Colors.light.primary,
                selectedDayTextColor: Colors.light.buttonText,
                todayTextColor: Colors.light.primary,
                textDisabledColor: Colors.light.disabled,
                arrowColor: Colors.light.primary,
              }}
            />
          </View>
          {startDate && endDate && (
            <Text style={styles.periodText}>
              Selected period: {new Date(startDate).toLocaleDateString()} -{' '}
              {new Date(endDate).toLocaleDateString()}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          label="Create Group"
          onPress={handleCreate}
          disabled={!name.trim() || !startDate || !endDate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: width * 0.05,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.06,
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    textAlign: 'center',
    marginRight: 10,
  },
  iconContainer: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: height * 0.03,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primaryText,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: width * 0.03,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodText: {
    fontSize: 14,
    color: Colors.light.primaryText,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: width * 0.05,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.secondary + '40',
  },
});
