// ==============================
// SUPABASE CONNECTION
// ==============================

const SUPABASE_URL =
    "https://oyxbasqhnyayxlvnqjwm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_7fiMU5n2V4lg17Wq3YjHig_2ZgYOjw8";


const obyaSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );