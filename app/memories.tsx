// ============================================
// 9. app/memories.tsx - PAGE SOUVENIRS (FR)
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import MemoryCard from '../components/MemoryCard';
import { getMemories, updateMemory, deleteMemory } from './services/api';

interface Memory {
  id: string;
  text: string;
  date: string;
  category?: string;
  emotion?: string;
}

export default function Memories() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getMemories(user.id);
      setMemories(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les souvenirs');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setEditText(memory.text);
  };

  const handleSaveEdit = async () => {
    if (!editingMemory) return;

    try {
      await updateMemory(editingMemory.id, { text: editText });
      setMemories(memories.map(m => 
        m.id === editingMemory.id ? { ...m, text: editText } : m
      ));
      setEditingMemory(null);
      setEditText('');
      Alert.alert('Succès', 'Souvenir mis à jour');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le souvenir');
    }
  };

  const handleDeleteMemory = async (id: string) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce souvenir ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMemory(id);
              setMemories(memories.filter(m => m.id !== id));
              Alert.alert('Succès', 'Souvenir supprimé');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le souvenir');
            }
          },
        },
      ]
    );
  };

  const renderMemory = ({ item }: { item: Memory }) => (
    <MemoryCard 
      memory={item} 
      onEdit={handleEditMemory}
      onDelete={handleDeleteMemory}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Chargement des souvenirs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Souvenirs</Text>
        <TouchableOpacity onPress={loadMemories} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {memories.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#BDC3C7" />
          <Text style={styles.emptyTitle}>Aucun souvenir</Text>
          <Text style={styles.emptySubtitle}>
            Commencez une conversation pour créer votre premier souvenir
          </Text>
        </View>
      ) : (
        <FlatList
          data={memories}
          renderItem={renderMemory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal d'édition */}
      <Modal
        visible={editingMemory !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingMemory(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le souvenir</Text>
            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setEditingMemory(null)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  listContainer: {
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#BDC3C7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 150,
    backgroundColor: '#F8F9FA',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E9ECEF',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
