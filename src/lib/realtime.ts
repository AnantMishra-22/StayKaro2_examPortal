import { supabase } from './supabase';

// Admin dashboard: live activity feed
export function subscribeActivityFeed(callback: (event: any) => void) {
  return supabase
    .channel('activity-feed')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_feed' },
      payload => callback(payload.new))
    .subscribe();
}

// Admin: live exam session monitoring
export function subscribeExamSessions(examId: string, callback: (session: any) => void) {
  return supabase
    .channel(`exam-sessions-${examId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'exam_sessions',
      filter: `exam_id=eq.${examId}`,
    }, payload => callback(payload))
    .subscribe();
}

// Member: live notifications bell
export function subscribeMemberNotifications(memberId: string, callback: (n: any) => void) {
  return supabase
    .channel(`member-notifs-${memberId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'member_notifications',
      filter: `member_id=eq.${memberId}`,
    }, payload => callback(payload.new))
    .subscribe();
}

// Unsubscribe helper
export function unsubscribe(channel: ReturnType<typeof supabase.channel>) {
  supabase.removeChannel(channel);
}
