// lib/supabase/server.ts - COMPLETE FIXED VERSION
import 'server-only';
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function createServerClient() {
  const cookieStore = await cookies();

  const supabase = createSupabaseServerClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle error
          }
        },
      },
    }
  );

  // Helper to get current user
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        phone: user.user_metadata?.phone || '',
        emailVerification: user.email_confirmed_at ? true : false,
        registration: user.created_at,
        labels: user.user_metadata?.is_admin ? ['admin'] : [],
        user_metadata: {
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          is_admin: user.user_metadata?.is_admin || false,
        }
      };
    } catch (error) {
      return null;
    }
  };

  return {
    supabase,
    getCurrentUser,
    auth: {
      getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) return { data: { user: null }, error };
        
        const formattedUser = user ? {
          $id: user.id,
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || '',
          phone: user.user_metadata?.phone || '',
          emailVerification: user.email_confirmed_at ? true : false,
          registration: user.created_at,
          labels: user.user_metadata?.is_admin ? ['admin'] : [],
          user_metadata: {
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            is_admin: user.user_metadata?.is_admin || false,
          }
        } : null;
        
        return { data: { user: formattedUser }, error: null };
      },
      getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        return { data: { session }, error };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
      }
    },
    from: (tableName: string) => {
      // Create a query builder with chainable methods
      const queryBuilder = (query: any) => ({
        eq: async (field: string, value: any) => {
          try {
            const { data, error } = await query.eq(field, value);
            
            return {
              data: data || [],
              error: error || null,
              single: async () => ({
                data: data && data[0] ? { 
                  ...data[0], 
                  $id: data[0].id, 
                  $createdAt: data[0].created_at, 
                  $updatedAt: data[0].updated_at 
                } : null,
                error: error || null
              })
            };
          } catch (error: any) {
            return { data: null, error };
          }
        },
        order: (field: string, ascending: boolean = true) => {
          const orderedQuery = query.order(field, { ascending });
          return queryBuilder(orderedQuery);
        },
        then: async (callback: any) => {
          try {
            const { data, error } = await query;
            
            const formattedData = data?.map((item: any) => ({
              ...item,
              $id: item.id,
              $createdAt: item.created_at,
              $updatedAt: item.updated_at
            }));
            
            return callback({ data: formattedData || null, error: error || null });
          } catch (error) {
            return callback({ data: null, error });
          }
        }
      });

      return {
        select: (columns: string = '*') => {
          const selectQuery = supabase.from(tableName).select(columns);
          return queryBuilder(selectQuery);
        },
        insert: async (data: any) => {
          try {
            const insertData = Array.isArray(data) ? data : [data];
            
            const { data: result, error } = await supabase
              .from(tableName)
              .insert(insertData)
              .select();
            
            if (error) return { data: null, error };
            
            const formattedResult = result?.map((item: any) => ({
              ...item,
              $id: item.id,
              $createdAt: item.created_at,
              $updatedAt: item.updated_at
            }));
            
            return { 
              data: Array.isArray(data) ? formattedResult : (formattedResult?.[0] || null), 
              error: null 
            };
          } catch (error: any) {
            return { data: null, error };
          }
        },
        update: async (data: any) => {
          if (!data.id) throw new Error('id required for update');
          
          const { id, ...updateData } = data;
          
          try {
            const { data: result, error } = await supabase
              .from(tableName)
              .update(updateData)
              .eq('id', id)
              .select();
            
            if (error) return { data: null, error };
            
            const formattedResult = result?.[0] ? {
              ...result[0],
              $id: result[0].id,
              $createdAt: result[0].created_at,
              $updatedAt: result[0].updated_at
            } : null;
            
            return { data: formattedResult, error: null };
          } catch (error: any) {
            return { data: null, error };
          }
        },
        upsert: async (data: any, onConflict: string = 'id') => {
          try {
            const { data: result, error } = await supabase
              .from(tableName)
              .upsert(data, { onConflict })
              .select();
            
            if (error) return { data: null, error };
            
            const formattedResult = result?.map((item: any) => ({
              ...item,
              $id: item.id,
              $createdAt: item.created_at,
              $updatedAt: item.updated_at
            }));
            
            return { data: formattedResult, error: null };
          } catch (error: any) {
            return { data: null, error };
          }
        },
        delete: async (id: string) => {
          try {
            const { error } = await supabase
              .from(tableName)
              .delete()
              .eq('id', id);
            
            return { error: error || null };
          } catch (error: any) {
            return { error };
          }
        }
      };
    },
    // Helper for raw Supabase queries when needed
    raw: () => supabase
  };
}

// Query helpers to maintain compatibility
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

// Helper function to apply Appwrite-style queries to Supabase
export async function applyQueries(
  supabaseQuery: any,
  queries: any[]
) {
  let query = supabaseQuery;
  
  for (const q of queries) {
    if (q.operator === 'eq') {
      query = query.eq(q.field, q.value);
    } else if (q.operator === 'neq') {
      query = query.neq(q.field, q.value);
    } else if (q.operator === 'lt') {
      query = query.lt(q.field, q.value);
    } else if (q.operator === 'lte') {
      query = query.lte(q.field, q.value);
    } else if (q.operator === 'gt') {
      query = query.gt(q.field, q.value);
    } else if (q.operator === 'gte') {
      query = query.gte(q.field, q.value);
    } else if (q.operator === 'ilike') {
      query = query.ilike(q.field, q.value);
    }
  }
  
  return query;
}

// ============================================
// 🔧 FIX ADDED HERE: Export createClient for compatibility
// ============================================

export async function createClient() {
  const { supabase, getCurrentUser, auth, from, raw } = await createServerClient();
  return {
    supabase,
    auth,
    from,
    raw,
    getCurrentUser,
  };
}

// Also export a simple version for quick access
export async function getSupabase() {
  const client = await createClient();
  return client.supabase;
}