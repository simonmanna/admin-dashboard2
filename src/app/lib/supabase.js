// /app/lib/supabase.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getOrders() {
  try {
    // Join orders with profiles using user_id in orders and id in profiles
    const { data, error } = await supabase.from("orders").select(`
        id,
        order_items,
        total_amount,
        delivery_address,
        created_at,
        status,
        user_id,
        total_amount_vat,
        profiles:user_id (
          id,
          full_name,
          phone_number
        )
      `);

    if (error) throw error;

    // Format the response to flatten the data
    const formattedData =
      data?.map((order) => ({
        id: order.id,
        order_items: order.order_items,
        total_amount: order.total_amount,
        delivery_address: order.delivery_address,
        created_at: order.created_at,
        status: order.status,
        user_id: order.user_id,
        total_amount_vat: order.total_amount_vat,
        customer_name: order.profiles?.full_name || "Unknown",
        customer_phone: order.profiles?.phone_number || "N/A",
      })) || [];

    return { data: formattedData, error: null };
  } catch (error) {
    console.error("Supabase query error:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}
async function getOrderById(id) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

async function updatePaymentStatus(id, payment_status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ payment_status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

async function getDeliveryPersons() {
  const { data, error } = await supabase.from("delivery_persons").select("*");

  return { data, error };
}

async function assignDeliveryPerson(orderId, deliveryPersonId) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      delivery_person_id: deliveryPersonId,
      status: "OUT_FOR_DELIVERY",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single();

  return { data, error };
}

module.exports = {
  supabase,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getDeliveryPersons,
  assignDeliveryPerson,
};
