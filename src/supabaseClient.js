import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxukfviieevcidogkkxs.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dWtmdmlpZWV2Y2lkb2dra3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNjE5ODcsImV4cCI6MjA0OTkzNzk4N30.C37RoqBbnFedygs8J9WrJ1XowZXNOWExhNFmAfw8eJQ';  // Replace with your Supabase public anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
