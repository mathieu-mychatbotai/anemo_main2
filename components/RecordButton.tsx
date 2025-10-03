// ============================================
// 7. components/RecordButton.tsx - MISE À JOUR FR
// ============================================
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export default function RecordButton({ isRecording, onPress }: RecordButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, isRecording && styles.recording]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={isRecording ? "stop" : "mic"} 
        size={60} 
        color="white" 
      />
      <Text style={styles.buttonText}>
        {isRecording ? "Arrêter" : "Commencer"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recording: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});
