import { supabase } from './supabase';

// ── Admin login (email/password) ──────────────────────────────
export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, member_code')
    .eq('id', data.user.id)
    .single();

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('Not authorized as admin');
  }
  return { user: data.user, profile };
}

// ── Member login (member_code + password) ────────────────────
export async function memberLogin(memberCode: string, password: string) {
  // Resolve email from member_code first
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email, status')
    .eq('member_code', memberCode)
    .single();

  if (profileError || !profile) throw new Error('Member code not found');
  if (profile.status === 'inactive') throw new Error('Account is inactive');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });
  if (error) throw error;
  return data;
}

// ── Get current session ───────────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ── Sign out ──────────────────────────────────────────────────
export async function signOut() {
  await supabase.auth.signOut();
}

// ── Change member password ────────────────────────────────────
export async function changePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ── Register member (admin creates) ──────────────────────────
export async function createMember(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}) {
  // Use service role client for admin-initiated registration
  const { data: authData, error } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
  });
  if (error) throw error;

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone || null,
    role: 'member',
    status: 'active',
  } as any);
  if (profileError) throw profileError;

  return authData.user;
}
