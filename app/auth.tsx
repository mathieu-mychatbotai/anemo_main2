// ============================================
// 8. app/auth.tsx - PAGE AUTHENTIFICATION (FR)
// ============================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import AuthInput from '../components/AuthInput';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      router.replace('/');
    } catch (error: any) {
      Alert.alert(
        'Erreur', 
        error.message || 'Échec de l\'authentification. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Anemo</Text>
          <Text style={styles.subtitle}>Votre compagnon de mémoire</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Bon retour' : 'Créer un compte'}
          </Text>
          
          {!isLogin && (
            <AuthInput
              label="Nom"
              value={name}
              onChangeText={setName}
              placeholder="Entrez votre nom"
              autoCapitalize="words"
            />
          )}
          
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Entrez votre email"
            keyboardType="email-address"
          />
          
          <AuthInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin 
                ? "Pas de compte ? Inscrivez-vous" 
                : 'Déjà un compte ? Connectez-vous'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#4A90E2', marginBottom: 8 },
  subtitle: { fontSize: 20, color: '#7F8C8D', fontWeight: '500' },
  form: { flex: 1 },
  formTitle: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', marginBottom: 30 },
  submitButton: { backgroundColor: '#4A90E2', padding: 18, borderRadius: 12, marginTop: 10 },
  submitButtonDisabled: { backgroundColor: '#BDC3C7' },
  submitButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  switchButton: { marginTop: 20, padding: 10 },
  switchText: { color: '#4A90E2', fontSize: 16, textAlign: 'center', fontWeight: '600' },
});
