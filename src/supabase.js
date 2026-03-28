import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdvqrfwjljrdmffqlaca.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdnFyZndqbGpyZG1mZnFsYWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODA0MjUsImV4cCI6MjA5MDE1NjQyNX0.QLIO_93YghX4uqcm1UsAZV9z_oWe7scNGCdCMqygb8c'

export const supabase = createClient(supabaseUrl, supabaseKey)