import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixNav() {
  console.log('Checking navigation settings...');
  const { data, error } = await supabase
    .from('navigation_settings')
    .select('*');
    
  if (error) {
    console.error('Error fetching settings:', error);
    process.exit(1);
  }

  console.log('Current keys:', data.map(d => d.section_key).join(', '));

  const testimonialRow = data.find(d => d.section_key === 'testimonials' || d.section_key === 'testimonial');
  
  if (testimonialRow) {
    console.log('Found old row, updating to endorsements...');
    const { error: updateError } = await supabase
      .from('navigation_settings')
      .update({ section_key: 'endorsements', section_name: 'Endorsements' })
      .eq('id', testimonialRow.id);
      
    if (updateError) {
      console.error('Update error:', updateError);
    } else {
      console.log('Update successful!');
    }
  } else {
    // Check if endorsements exists
    const endorsementRow = data.find(d => d.section_key === 'endorsements');
    if (!endorsementRow) {
      console.log('Inserting endorsements...');
      await supabase.from('navigation_settings').insert({
        section_key: 'endorsements',
        section_name: 'Endorsements',
        enabled: true,
        display_order: 8
      });
      console.log('Insert successful!');
    } else {
      console.log('Already updated.');
    }
  }
}

fixNav();
