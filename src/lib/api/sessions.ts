import { supabase } from '../supabase';

export const sessionsApi = {
  // Start exam session
  async start(examId: string) {
    const user = (await supabase.auth.getUser()).data.user!;
    const { data, error } = await supabase.from('exam_sessions')
      .insert({ exam_id: examId, member_id: user.id, status: 'active', answers: {} })
      .select().single();
    if (error) throw error;

    // Log to activity feed
    await supabase.from('activity_feed').insert({
      event_type: 'start', member_id: user.id, exam_id: examId,
      description: `Started exam session`,
    });
    return data;
  },

  // Save answers in real-time (auto-save every 30s)
  async saveAnswers(sessionId: string, answers: Record<string, number>) {
    const { error } = await supabase.from('exam_sessions')
      .update({ answers }).eq('id', sessionId);
    if (error) throw error;
  },

  // Log anti-cheat violation
  async logViolation(sessionId: string, type: string, currentSwitches: number) {
    const { data: session } = await supabase
      .from('exam_sessions').select('violation_log, tab_switches').eq('id', sessionId).single();
    const log = [...(session?.violation_log || []), { timestamp: new Date().toISOString(), type }];
    await supabase.from('exam_sessions')
      .update({ violation_log: log as any, tab_switches: currentSwitches }).eq('id', sessionId);
  },

  // Submit exam — triggers score calculation
  async submit(sessionId: string, answers: Record<string, number>, examId: string) {
    // Fetch correct answers
    const { data: eqs } = await supabase
      .from('exam_questions')
      .select('question_id, questions(correct_index, marks)')
      .eq('exam_id', examId);

    let correct = 0, wrong = 0, totalMarks = 0, score = 0;
    eqs?.forEach((eq: any) => {
      const q = eq.questions;
      totalMarks += q.marks;
      const given = answers[eq.question_id];
      if (given === undefined) return;
      if (given === q.correct_index) { correct++; score += q.marks; }
      else wrong++;
    });
    const unattempted = (eqs?.length || 0) - correct - wrong;
    const scorePct = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    const { data, error } = await supabase.from('exam_sessions').update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      time_out: new Date().toISOString(),
      answers,
      score: scorePct,
      total_marks: totalMarks,
      correct_count: correct,
      wrong_count: wrong,
      unattempted,
    }).eq('id', sessionId).select().single();
    if (error) throw error;

    // Update member avg_score + exams_taken
    const user = (await supabase.auth.getUser()).data.user!;
    const { data: allSessions } = await supabase
      .from('exam_sessions').select('score').eq('member_id', user.id).eq('status', 'submitted');
    const scores = allSessions?.map(s => s.score).filter(Boolean) as number[];
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    await supabase.from('profiles').update({
      exams_taken: scores.length, avg_score: Math.round(avgScore * 10) / 10,
    }).eq('id', user.id);

    await supabase.from('activity_feed').insert({
      event_type: 'complete', member_id: user.id, exam_id: examId,
      description: `Completed exam — Score: ${scorePct}%`,
    });

    return data;
  },

  // Request retry (member requests admin permission)
  async requestRetry(sessionId: string) {
    const { error } = await supabase.from('exam_sessions')
      .update({ request_retry: true }).eq('id', sessionId);
    if (error) throw error;
  },

  // Admin grants retry (resets session)
  async grantRetry(examId: string, memberId: string) {
    const { error } = await supabase.from('exam_sessions')
      .delete().eq('exam_id', examId).eq('member_id', memberId);
    if (error) throw error;
  },

  // Get results for a member
  async getMemberResults(memberId: string) {
    const { data, error } = await supabase
      .from('v_member_results').select('*').eq('member_id', memberId)
      .order('submitted_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Get all results for admin (sorted by score)
  async getAllResults(examId?: string) {
    let query = supabase.from('v_member_results').select('*');
    if (examId) query = query.eq('exam_id', examId);
    const { data, error } = await query.order('score', { ascending: false });
    if (error) throw error;
    return data;
  },
};
