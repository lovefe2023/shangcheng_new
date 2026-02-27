import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name)');
    if (error) throw error;
    return data;
}

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*');
    if (error) throw error;
    return data;
}

export async function getOrders(userId: string) {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(*))')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
}
