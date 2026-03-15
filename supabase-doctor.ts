import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

async function checkSupabase() {
    console.log('Checking Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key present:', !!supabaseAnonKey);

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase environment variables.');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    try {
        const { data, error } = await supabase.from('downloads').select('*', { count: 'exact', head: true });
        if (error) {
            console.error('Supabase query failed:', error.message);
            console.error('Error code:', error.code);
        } else {
            console.log('Supabase connection successful! Found', data, 'downloads (metadata).');
        }
    } catch (err) {
        console.error('Fatal error checking Supabase:', err);
    }
}

checkSupabase();
