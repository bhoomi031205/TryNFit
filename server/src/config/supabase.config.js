import { createClient } from '@supabase/supabase-js';
import { config } from './env.config.js';

export const isSupabaseConfigured = Boolean(
  config.supabaseUrl &&
  config.supabaseUrl.startsWith('http') &&
  (config.supabaseServiceKey || config.supabaseAnonKey)
);

let adminClient = null;

/**
 * Returns the Supabase Admin/Service client (bypasses RLS for system triggers/ops)
 */
export const getSupabaseAdminClient = () => {
  if (!isSupabaseConfigured) return null;

  if (!adminClient) {
    const key = config.supabaseServiceKey || config.supabaseAnonKey;
    adminClient = createClient(config.supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
};

/**
 * Returns a user-scoped Supabase client that obeys Row Level Security (RLS)
 */
export const getSupabaseUserClient = (token) => {
  if (!isSupabaseConfigured || !config.supabaseAnonKey) return null;

  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
};
