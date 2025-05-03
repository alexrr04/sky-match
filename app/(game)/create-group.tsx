import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

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
          selected: true
        }
      });
    } else {
      // Complete the selection
      const dateString = day.dateString;
      if (dateString < startDate) {
        // If end date is before start date, swap them
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
            selected: true
          };
        } else if (dateStr === dateString) {
          range[dateStr] = {
            endingDay: true,
            color: Colors.light.primary,
            textColor: Colors.light.buttonText,
            selected: true
          };
        } else {
          range[dateStr] = {
            color: Colors.light.primary,
            textColor: Colors.light.buttonText,
            selected: true
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setMarkedDates(range);
    }
  };

  const handleCreate = () => {
    if (name.trim() && startDate && endDate) {
      // TODO: Handle group creation logic
      router.push('/(game)/lobby');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Trip Group</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={Colors.light.placeholder}
        />
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
            Selected period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </Text>
        )}
      </View>

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
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    margin: 50,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.light.primaryText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    color: Colors.light.primaryText,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
  },
  buttonContainer: {
    marginTop: 20,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
    padding: 10,
    marginBottom: 10,
  },
  periodText: {
    fontSize: 14,
    color: Colors.light.primaryText,
    textAlign: 'center',
    marginTop: 5,
  },
});
