import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsers() {
  console.log("Signing up Admin...");
  const adminRes = await supabase.auth.signUp({
    email: 'realadmin@srisoultech.com',
    password: 'password123',
  });
  if (adminRes.data?.user?.id) {
    await supabase.from('profiles').insert({
       id: adminRes.data.user.id,
       role: 'admin', full_name: 'System Admin', status: 'active', member_code: 'ADM999'
    });
    console.log("Admin fully created!");
  }

  console.log("Signing up Member...");
  const memberRes = await supabase.auth.signUp({
    email: 'realmember@srisoultech.com',
    password: 'password123',
  });
  if (memberRes.data?.user?.id) {
    await supabase.from('profiles').insert({
       id: memberRes.data.user.id,
       role: 'member', full_name: 'Test Student', status: 'active', member_code: 'STU999'
    });
    console.log("Member fully created!");
  }
}

createUsers();
