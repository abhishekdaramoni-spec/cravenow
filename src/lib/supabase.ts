import { createClient } from '@supabase/supabase-js';
import { isDemoMode } from './constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isDemo = isDemoMode();

/**
 * Wraps a Supabase query. In demo mode, returns the fallback value instead.
 */
export async function demoGuard<T>(
  query: () => Promise<{ data: T | null; error: unknown }>,
  fallback: T
): Promise<T> {
  if (isDemo) return fallback;
  try {
    const { data, error } = await query();
    if (error) {
      console.error('Supabase error:', error);
      return fallback;
    }
    return data ?? fallback;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return fallback;
  }
}
