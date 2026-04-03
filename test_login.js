import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testAuth() {
  console.log("Attempting sign in...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'realadmin@srisoultech.com',
    password: 'password123'
  });
  console.log("Sign in error:", error);
  console.log("Sign in data:", data?.user?.id);
}
testAuth();
