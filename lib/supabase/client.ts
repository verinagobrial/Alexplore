// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  tables: {
    profiles: 'profiles',
    bookings: 'bookings',
    messages: 'messages',
    subscribers: 'subscribers',
  }
};

// Create a singleton client for browser use
let clientInstance: SupabaseClient | null = null;

export function createClient() {
  if (typeof window === 'undefined') {
    // Server-side: create new client
    return createBrowserClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
  }

  // Client-side: reuse instance
  if (!clientInstance) {
    clientInstance = createBrowserClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );
  }

  return clientInstance;
}

// Helper to convert Supabase user to consistent format
export function formatSupabaseUser(user: any) {
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      phone: user.user_metadata?.phone || '',
      is_admin: user.user_metadata?.is_admin || false,
    },
    created_at: user.created_at,
  };
}

// Helper to format Supabase data (rows are already in good shape, but kept for API consistency)
export function formatSupabaseData(data: any) {
  if (!data) return null;
  
  // Supabase already returns data with id, created_at, updated_at
  // This function exists for backward compatibility with Appwrite format
  return data;
}

// Helper to generate IDs (similar to Appwrite's ID.unique())
export function generateId() {
  return crypto.randomUUID();
}

// Query helpers to match Appwrite Query syntax
export const Query = {
  equal: (field: string, value: any) => ({ field, operator: 'eq', value }),
  notEqual: (field: string, value: any) => ({ field, operator: 'neq', value }),
  lessThan: (field: string, value: any) => ({ field, operator: 'lt', value }),
  lessThanEqual: (field: string, value: any) => ({ field, operator: 'lte', value }),
  greaterThan: (field: string, value: any) => ({ field, operator: 'gt', value }),
  greaterThanEqual: (field: string, value: any) => ({ field, operator: 'gte', value }),
  search: (field: string, value: string) => ({ field, operator: 'ilike', value: `%${value}%` }),
  orderDesc: (field: string) => ({ field, order: 'desc' }),
  orderAsc: (field: string) => ({ field, order: 'asc' }),
  limit: (limit: number) => ({ limit }),
  offset: (offset: number) => ({ offset }),
};

// Helper to convert Appwrite-style queries to Supabase format
export function applyQueryFilters(query: any, filters: any[]) {
  let supabaseQuery = query;
  
  for (const filter of filters) {
    if (filter.operator === 'eq') {
      supabaseQuery = supabaseQuery.eq(filter.field, filter.value);
    } else if (filter.operator === 'neq') {
      supabaseQuery = supabaseQuery.neq(filter.field, filter.value);
    } else if (filter.operator === 'lt') {
      supabaseQuery = supabaseQuery.lt(filter.field, filter.value);
    } else if (filter.operator === 'lte') {
      supabaseQuery = supabaseQuery.lte(filter.field, filter.value);
    } else if (filter.operator === 'gt') {
      supabaseQuery = supabaseQuery.gt(filter.field, filter.value);
    } else if (filter.operator === 'gte') {
      supabaseQuery = supabaseQuery.gte(filter.field, filter.value);
    } else if (filter.operator === 'ilike') {
      supabaseQuery = supabaseQuery.ilike(filter.field, filter.value);
    }
  }
  
  return supabaseQuery;
}

// Example usage of the client
export async function getSupabaseData() {
  const supabase = createClient();
  
  // Query example
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', 'some-id');
  
  if (error) throw error;
  return formatSupabaseData(data);
}