// ============================================
// 1. app/index.tsx - PAGE PRINCIPALE
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import RecordButton from '../components/RecordButton';
import ConversationPrompt from '../components/ConversationPrompt';
import StatusIndicator from '../components/StatusIndicator';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { saveMemory } from './services/api';

const conversationPrompts = [
  "Parlez-moi d'un moment significatif de votre enfance.",
  "Quelle était votre tradition familiale préférée en grandissant ?",
  "Décrivez un endroit qui contient des souvenirs spéciaux pour vous.",
  "Parlez-moi de quelqu'un qui a eu un grand impact sur votre vie.",
  "Quelle compétence ou passe-temps avez-vous aimé quand vous étiez plus jeune ?",
  "Racontez-moi votre premier jour d'école.",
  "Quel est votre souvenir de vacances préféré ?",
  "Parlez-moi d'un ami d'enfance spécial."
];

export default function Index() {
  const { user, signOut } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [showPrompt, setShowPrompt] = useState(false);
  const { startListening, stopListening, transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (!user) {
      router.replace('/auth');
    }
  }, [user]);

  const handleRecordPress = async () => {
    if (!isRecording) {
      const randomPrompt = conversationPrompts[Math.floor(Math.random() * conversationPrompts.length)];
      setCurrentPrompt(randomPrompt);
      setShowPrompt(true);
      setIsRecording(true);
      setStatus('listening');
      resetTranscript();
      
      const success = await startListening();
      if (!success) {
        Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement vocal');
        setIsRecording(false);
        setStatus('idle');
        setShowPrompt(false);
      }
    } else {
      setIsRecording(false);
      setStatus('processing');
      setShowPrompt(false);
      
      await stopListening();
      
      if (transcript && transcript.length > 10) {
        try {
          await saveMemory({
            text: transcript,
            userId: user?.id || '',
            category: 'Personnel',
            emotion: 'Réflexif',
          });
          
          setStatus('idle');
          Alert.alert('Souvenir enregistré', 'Votre souvenir a été enregistré avec succès !');
        } catch (error) {
          setStatus('idle');
          Alert.alert('Erreur', 'Impossible de sauvegarder le souvenir');
        }
      } else {
        setStatus('idle');
        Alert.alert('Attention', 'Aucune parole détectée. Veuillez réessayer.');
      }
      
      resetTranscript();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Anemo</Text>
        <Text style={styles.subtitle}>Votre compagnon de mémoire</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <StatusIndicator status={status} />
        <ConversationPrompt prompt={currentPrompt} isVisible={showPrompt} />
        
        {isRecording && transcript && (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>Transcription en cours :</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <RecordButton isRecording={isRecording} onPress={handleRecordPress} />
          <Text style={styles.instruction}>
            {isRecording 
              ? 'Parlez naturellement de votre souvenir' 
              : 'Appuyez pour commencer une conversation'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.memoriesBanner} 
          onPress={() => router.push('/memories')}
          activeOpacity={0.8}
        >
          <Ionicons name="library" size={32} color="#4A90E2" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Voir mes souvenirs</Text>
            <Text style={styles.bannerSubtitle}>Parcourez et modifiez vos histoires</Text>
          </View>
          <Ionicons name="chevron-forward" size={28} color="#4A90E2" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20, position: 'relative' },
  title: { fontSize: 36, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#7F8C8D', fontWeight: '500' },
  headerButtons: { position: 'absolute', top: 40, right: 20, flexDirection: 'row', gap: 10 },
  signOutButton: { backgroundColor: '#FFEBEE', padding: 8, borderRadius: 20 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  buttonContainer: { marginVertical: 40, alignItems: 'center' },
  instruction: { fontSize: 16, color: '#7F8C8D', textAlign: 'center', marginTop: 20, paddingHorizontal: 40 },
  memoriesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 30,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerTextContainer: { flex: 1, marginLeft: 16 },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  bannerSubtitle: { fontSize: 14, color: '#7F8C8D' },
  transcriptContainer: {
    backgroundColor: '#F0F8FF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    width: '90%',
    maxHeight: 200,
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
});
