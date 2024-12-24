// app/components/PlayerNameInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type PlayerNameInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const PlayerNameInput = ({ label, value, onChangeText }: PlayerNameInputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Enter name"
      placeholderTextColor="#A0AEC0"
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});