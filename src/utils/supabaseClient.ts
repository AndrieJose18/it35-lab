import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://inonmsiqhaqpdvuzxknt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlub25tc2lxaGFxcGR2dXp4a250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NzQzNDEsImV4cCI6MjA1ODM1MDM0MX0.21x1gTTPDXgCZXDMK_hLN56sUhkwZVngP0fgvKB6ulE";

export const supabase = createClient(supabaseUrl, supabaseKey);