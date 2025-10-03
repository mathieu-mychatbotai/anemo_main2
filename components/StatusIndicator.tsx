// ============================================
// 6. components/StatusIndicator.tsx - MISE À JOUR FR
// ============================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusIndicatorProps {
  status: 'idle' | 'listening' | 'processing' | 'speaking';
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'listening':
        return { icon: 'ear', color: '#E74C3C', text: 'Écoute en cours...' };
      case 'processing':
        return { icon: 'cog', color: '#F39C12', text: 'Traitement...' };
      case 'speaking':
        return { icon: 'volume-high', color: '#27AE60', text: 'IA parle...' };
      default:
        return { icon: 'checkmark-circle', color: '#95A5A6', text: 'Prêt' };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={styles.container}>
      <Ionicons name={config.icon as any} size={24} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    marginVertical: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
