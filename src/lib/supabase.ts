import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isValidHttpUrl(value: string | undefined) {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

const hasValidSupabaseUrl = isValidHttpUrl(supabaseUrl);

export const hasPublicSupabase = Boolean(
  hasValidSupabaseUrl && supabaseAnonKey
);
export const hasAdminSupabase = Boolean(hasValidSupabaseUrl && serviceRoleKey);

const missingClientMessage =
  'Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.';

const missingClient = new Proxy(
  {},
  {
    get() {
      throw new Error(missingClientMessage);
    },
  }
) as SupabaseClient;

export const supabase = hasPublicSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : missingClient;

// For admin operations (server-side only)
export const createAdminClient = () => {
  if (!hasAdminSupabase) {
    throw new Error(missingClientMessage);
  }

  return createClient(supabaseUrl!, serviceRoleKey!);
};
