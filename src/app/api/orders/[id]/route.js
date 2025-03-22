// pages/api/orders/[id].js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  // Handle GET request
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (id, full_name, email),
          delivery_person:delivery_person_id (id, name, phone)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
  }
  
  // Handle PATCH request (update order)
  if (req.method === 'PATCH') {
    const updates = req.body;
    
    if (!updates) {
      return res.status(400).json({ message: 'Update data is required' });
    }
    
    try {
      // Add updated_at timestamp
      updates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return res.status(200).json({ message: 'Order updated successfully', data });
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ message: 'Failed to update order', error: error.message });
    }
  }
}