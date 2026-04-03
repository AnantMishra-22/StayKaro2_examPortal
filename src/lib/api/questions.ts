import { supabase } from '../supabase';

export const questionsApi: any = {
  async getAll(filters?: { subjectId?: string; difficulty?: string; search?: string }) {
    let query = supabase
      .from('questions')
      .select(`*, subjects(name, name_te), topics(name)`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.subjectId) query = query.eq('subject_id', filters.subjectId);
    if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);
    if (filters?.search) query = query.ilike('text', `%${filters.search}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(question: {
    subject_id: string; topic_id?: string; text: string; text_te?: string;
    options: string[]; options_te?: string[]; correct_index: number;
    difficulty: 'Easy' | 'Medium' | 'Hard'; marks?: number;
  }) {
    const { data, error } = await supabase
      .from('questions').insert({ ...question, created_by: (await supabase.auth.getUser()).data.user?.id } as any)
      .select().single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ReturnType<typeof questionsApi.create extends (...args: any[]) => Promise<infer R> ? () => R : never>>) {
    const { data, error } = await supabase
      .from('questions').update(updates as any).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('questions').update({ is_active: false }).eq('id', id);
    if (error) throw error;
  },

  // Bulk import from Excel-parsed JSON
  async bulkImport(questions: any[]) {
    const { data, error } = await supabase.from('questions').insert(questions).select();
    if (error) throw error;
    return data;
  },

  async getSubjects() {
    const { data, error } = await supabase
      .from('subjects').select('*, topics(*), questions(count)').order('name');
    if (error) throw error;
    return data;
  },
};
