// ============================================
// 2. app/hooks/useSpeechRecognition.ts - HOOK VOCAL
// ============================================
import { useState, useEffect } from 'react';
import { 
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    const result = await ExpoSpeechRecognitionModule.getStateAsync();
    setIsAvailable(result.state === 'available');
  };

  useSpeechRecognitionEvent('result', (event) => {
    const transcribedText = event.results[0]?.transcript || '';
    setTranscript(transcribedText);
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  });

  const startListening = async () => {
    try {
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      
      await ExpoSpeechRecognitionModule.start({
        lang: 'fr-FR',
        interimResults: true,
        maxAlternatives: 1,
        continuous: true,
        requiresOnDeviceRecognition: false,
        addsPunctuation: true,
        contextualStrings: [
          'enfance',
          'famille',
          'souvenir',
          'grand-mère',
          'grand-père',
        ],
      });
      
      setIsListening(true);
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  };

  const stopListening = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    isListening,
    isAvailable,
    startListening,
    stopListening,
    resetTranscript,
  };
}
