import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yyhjlffkylorqliaayaq.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5aGpsZmZreWxvcnFsaWFheWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjM5MjMsImV4cCI6MjA5MDAzOTkyM30.KA_AQa5thrWzv_B3E8qknX9RE6sJW7OuEB58nRQ2zT0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
