// components/OrderStatusAdmin.jsx
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function OrderStatusAdmin({ orderId, currentStatus, onStatusChange }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  
  // Available order statuses
  const orderStatuses = [
    'ORDER_PLACED',
    'CONFIRMED',
    'PREPARING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];
  
  // Function to update status
  const updateStatus = async (newStatus) => {
    if (newStatus === currentStatus) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(`Failed to update: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h3 className="text-lg font-medium mb-3">Update Order Status</h3>
      
      <div className="space-y-4">
        {orderStatuses.map((orderStatus) => (
          <button
            key={orderStatus}
            onClick={() => updateStatus(orderStatus)}
            disabled={updating || status === orderStatus}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              status === orderStatus 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            {orderStatus.replace(/_/g, ' ')}
          </button>
        ))}
        
        {updating && <p className="text-sm text-gray-500 text-center">Updating status...</p>}
      </div>
    </div>
  );
}

// utils/realtimeHelper.js
export function subscribeToOrderUpdates(orderId, callback) {
  if (!orderId) return null;
  
  const subscription = supabase
    .channel(`order-${orderId}`)
    .on('postgres_changes', { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'orders',
      filter: `id=eq.${orderId}` 
    }, (payload) => {
      if (callback && typeof callback === 'function') {
        callback(payload);
      }
    })
    .subscribe();
    
  return subscription;
}

export function unsubscribeFromChannel(subscription) {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
}