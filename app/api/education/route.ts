import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('education')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('education')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const { data, error } = await supabaseAdmin
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Education ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('education')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
