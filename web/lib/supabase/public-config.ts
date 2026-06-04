/**
 * Public Supabase project URL + anon key (same values as app.json → expo.extra).
 * Safe to commit — the anon key is already exposed in the mobile app bundle.
 * Used when Vercel env vars are not set; inserts go through /api/waitlist only.
 */
export const PUBLIC_SUPABASE_URL = 'https://afixdzyeybxgcqpbynud.supabase.co';

export const PUBLIC_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaXhkenlleWJ4Z2NxcGJ5bnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MzcwMDEsImV4cCI6MjA5NjAxMzAwMX0.vUUquuJcKB4khjJ6VFlKOokjCRwCzGACaXzFcqYZqPU';
