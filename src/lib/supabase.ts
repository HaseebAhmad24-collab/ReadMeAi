import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For backend operations that need full access
export const getSupabaseService = () => {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });
};

export type User = {
  id: string;
  github_id: string;
  username: string;
  email: string;
  avatar_url: string;
  plan: 'free' | 'pro';
  created_at: string;
};

export type Generation = {
  id: string;
  user_id: string;
  repo_name: string;
  repo_url: string;
  readme_content: string;
  pushed_at: string | null;
  created_at: string;
};

export type UsageTracking = {
  id: string;
  user_id: string;
  month_year: string; // e.g., "04-2024"
  count: number;
};
