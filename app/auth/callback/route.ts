import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    
    // Supabase automatically exchanges the code when you call getSession
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth error:', error.message);
      return NextResponse.redirect(new URL('/auth/login?error=auth', request.url));
    }
    
    if (session) {
      // Successfully authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.redirect(new URL('/auth/login', request.url));
}