// ============================================
// 10. components/MemoryCard.tsx - CARTE MÉMOIRE (FR)
// ============================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Memory {
  id: string;
  text: string;
  date: string;
  category?: string;
  emotion?: string;
}

interface MemoryCardProps {
  memory: Memory;
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
}

export default function MemoryCard({ memory, onEdit, onDelete }: MemoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(memory.date)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(memory)} style={styles.actionButton}>
            <Ionicons name="pencil" size={20} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(memory.id)} style={styles.actionButton}>
            <Ionicons name="trash" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>
      
      {(memory.category || memory.emotion) && (
        <View style={styles.tagContainer}>
          {memory.category && <Text style={styles.tag}>{memory.category}</Text>}
          {memory.emotion && <Text style={[styles.tag, styles.emotionTag]}>{memory.emotion}</Text>}
        </View>
      )}
      
      <Text style={styles.memoryText}>{memory.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#E8F4FD',
    color: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  emotionTag: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
  },
  memoryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
  },
});
