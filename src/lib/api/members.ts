import { supabase } from '../supabase';

export const membersApi = {
  // Get all members (admin)
  async getAll(filters?: { status?: string; search?: string }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'member')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all')
      query = query.eq('status', filters.status);
    if (filters?.search)
      query = query.or(`full_name.ilike.%${filters.search}%,member_code.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get single member
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  // Update member
  async update(id: string, updates: Partial<{ full_name: string; status: string; phone: string }>) {
    const { data, error } = await supabase
      .from('profiles').update(updates as any).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // Delete member
  async delete(id: string) {
    // Deletes auth.users row → cascade deletes profile
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
  },

  // Upload member photo
  async uploadPhoto(memberId: string, file: File) {
    const ext = file.name.split('.').pop();
    const path = `${memberId}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('member-photos').upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('member-photos').getPublicUrl(path);
    await supabase.from('profiles').update({ photo_url: data.publicUrl }).eq('id', memberId);
    return data.publicUrl;
  },

  // Clear all member results
  async clearAllResults() {
    const { error } = await supabase
      .from('exam_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  },

  // Clear single member results
  async clearMemberResults(memberId: string) {
    const { error } = await supabase
      .from('exam_sessions').delete().eq('member_id', memberId);
    if (error) throw error;
  },

  // Get leaderboard
  async getLeaderboard() {
    const { data, error } = await supabase.from('v_leaderboard').select('*').limit(20);
    if (error) throw error;
    return data;
  },
};
