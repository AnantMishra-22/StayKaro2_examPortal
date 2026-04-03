import { supabase } from '../supabase';

export const notificationsApi = {
  async send(notif: {
    title: string; title_te?: string; message: string; message_te?: string;
    recipient_type: 'all' | 'selected'; member_ids?: string[];
    scheduled_at?: string;
  }) {
    const user = (await supabase.auth.getUser()).data.user!;
    const { data, error } = await supabase.from('notifications').insert({
      title: notif.title, title_te: notif.title_te,
      message: notif.message, message_te: notif.message_te,
      recipient_type: notif.recipient_type,
      status: notif.scheduled_at ? 'scheduled' : 'sent',
      scheduled_at: notif.scheduled_at || null,
      sent_by: user.id,
    } as any).select().single();
    if (error) throw error;

    // Fan out to member_notifications inbox
    if (notif.recipient_type === 'all') {
      const { data: members } = await supabase
        .from('profiles').select('id').eq('role', 'member').eq('status', 'active');
      if (members?.length) {
        await supabase.from('member_notifications').insert(
          members.map(m => ({ notification_id: data.id, member_id: m.id }))
        );
      }
    } else if (notif.member_ids?.length) {
      await supabase.from('member_notifications').insert(
        notif.member_ids.map(mid => ({ notification_id: data.id, member_id: mid }))
      );
    }
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('notifications').select('*, profiles(full_name)').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getForMember(memberId: string) {
    const { data, error } = await supabase
      .from('member_notifications')
      .select('*, notifications(*)')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async markRead(notificationId: string, memberId: string) {
    await supabase.from('member_notifications')
      .update({ is_read: true }).eq('notification_id', notificationId).eq('member_id', memberId);
  },

  async getTicker() {
    const { data, error } = await supabase
      .from('ticker_messages').select('*').eq('is_active', true).order('order_idx');
    if (error) throw error;
    return data;
  },

  async updateTicker(messages: Array<{ id?: string; message: string; message_te?: string }>) {
    await supabase.from('ticker_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('ticker_messages').insert(
      messages.map((m, i) => ({ ...m, is_active: true, order_idx: i } as any))
    );
  },
};
