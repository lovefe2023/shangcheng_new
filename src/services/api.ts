import { supabase } from '../lib/supabase';

export const api = {
    // Products
    async getProducts(category?: string) {
        let query = supabase.from('products').select('*, categories(*)');
        if (category) {
            // In a real app, you'd filter by category name or ID
            // For now, let's assume we filter by category name in a joined query
            // This is a simplified version
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async getProduct(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(*)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Categories
    async getCategories() {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return data;
    },

    // Orders (via custom backend for extra logic like stock validation)
    async createOrder(orderData: any) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        return response.json();
    },

    async getOrders(userId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', userId);
        if (error) throw error;
        return data;
    }
};
