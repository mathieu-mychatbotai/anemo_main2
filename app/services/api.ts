// ============================================
// 3. app/services/api.ts - SERVICE API
// ============================================
import { supabase } from './supabase';

export interface Memory {
  id?: string;
  text: string;
  date?: string;
  category?: string;
  emotion?: string;
  userId: string;
  createdAt?: string;
}

export async function saveMemory(memory: Memory) {
  const { data, error } = await supabase
    .from('memories')
    .insert([
      {
        text: memory.text,
        category: memory.category,
        emotion: memory.emotion,
        user_id: memory.userId,
        date: new Date().toISOString(),
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getMemories(userId: string) {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateMemory(id: string, updates: Partial<Memory>) {
  const { data, error } = await supabase
    .from('memories')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteMemory(id: string) {
  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
