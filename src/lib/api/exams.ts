import { supabase } from '../supabase';

export const examsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('exams').select('*, subjects(name)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(exam: {
    title: string; title_te?: string; subject_id?: string;
    total_questions: number; duration_minutes: number;
    difficulty_easy_pct: number; difficulty_med_pct: number; difficulty_hard_pct: number;
    shuffle_questions: boolean; shuffle_options: boolean;
    permission_type: 'all' | 'selected'; pass_percentage?: number;
  }) {
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('exams').insert({ ...exam, created_by: user?.id, status: 'draft' } as any)
      .select().single();
    if (error) throw error;
    return data;
  },

  // Assign exam to specific members
  async setPermissions(examId: string, memberIds: string[]) {
    await supabase.from('exam_permissions').delete().eq('exam_id', examId);
    if (memberIds.length === 0) return;
    const { error } = await supabase.from('exam_permissions')
      .insert(memberIds.map(member_id => ({ exam_id: examId, member_id })));
    if (error) throw error;
  },

  // Set exam status: open, closed, etc.
  async setStatus(examId: string, status: 'draft' | 'open' | 'assigned' | 'closed') {
    const { error } = await supabase.from('exams').update({ status }).eq('id', examId);
    if (error) throw error;
  },

  // Get exam with its questions for a member's live session
  async getExamForMember(examId: string) {
    const { data: exam, error } = await supabase
      .from('exams').select(`*, exam_questions(question_id, order_index)`).eq('id', examId).single();
    if (error) throw error;

    const questionIds = (exam as any).exam_questions.map((eq: any) => eq.question_id);
    const { data: questions } = await supabase
      .from('questions').select('id, text, text_te, options, options_te, marks, difficulty')
      .in('id', questionIds);

    // Apply shuffles
    let qs = questions || [];
    if (exam.shuffle_questions) qs = qs.sort(() => Math.random() - 0.5);
    if (exam.shuffle_options) {
      qs = qs.map((q: any) => {
        const shuffled = [...q.options].map((o, i) => ({ o, i })).sort(() => Math.random() - 0.5);
        return { ...q, options: shuffled.map(s => s.o), _optionMap: shuffled.map(s => s.i) };
      });
    }
    return { exam, questions: qs };
  },
};
