
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkjyhpvffexdcsetajno.supabase.co';

// --- IMPORTANT SECURITY NOTICE ---
// You MUST use your PUBLIC ANONYMOUS KEY here, not your secret service_role key.
// Using a secret key on the client-side is a major security risk.
//
// How to find your public anon key:
// 1. Go to your Supabase project dashboard.
// 2. Click on the "Settings" icon (gear).
// 3. Click on "API".
// 4. Under "Project API keys", copy the key labeled "anon" and "public".
// 5. Paste that key below to replace 'YOUR_SUPABASE_ANON_KEY'.
// FIX: Explicitly typing the key as a string prevents TypeScript from inferring
// it as a literal type, which caused a comparison error with the placeholder.
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpranlocHZmZmV4ZGNzZXRham5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTI0NjcsImV4cCI6MjA4NDEyODQ2N30.cgIbqsm2X3rzYFmrR3ZhSrPzQAvcA47aFynmztpnjYY';

if (supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('Supabase Anon Key is not set. Please update it in services/supabaseClient.ts with your public anon key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);