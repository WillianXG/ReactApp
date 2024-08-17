import { createClient } from '@supabase/supabase-js';

// Substitua os valores abaixo pelos valores obtidos do seu projeto no Supabase
const supabaseUrl = 'https://slcqpbnzklomznghkioq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsY3FwYm56a2xvbXpuZ2hraW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM4NDg3OTEsImV4cCI6MjAzOTQyNDc5MX0.5twJFh_0_dhRCrc_Bnk89cQc_Z1DkJfQv95Y3ue89hs';

export const supabase = createClient(supabaseUrl, supabaseKey);
