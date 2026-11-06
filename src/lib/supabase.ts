import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  streamUrl: string;
  duration: number;
  mood: string;
  genre: string;
}
