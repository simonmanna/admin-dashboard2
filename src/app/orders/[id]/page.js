// app/orders/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { format } from "date-fns";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function OrderView({ params }) {
  const router = useRouter();
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const orderStatuses = [
    "ORDER_PLACED",
    "CONFIRMED",
    "PREPARING",
    "READY_FOR_PICKUP",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            profiles:user_id (full_name, email)
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          const orderData = {
            ...data,
            order_items:
              typeof data.order_items === "string"
                ? JSON.parse(data.order_items)
                : data.order_items,
            user: data.profiles,
          };
          setOrder(orderData);
        }
      } catch (e) {
        console.error("Error fetching order:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();

    let subscription;
    if (id) {
      subscription = supabase
        .channel(`order-${id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${id}`,
          },
          (payload) => {
            console.log("Real-time update received:", payload);
            setOrder((prevOrder) => {
              if (!prevOrder) return null;

              const updatedData = {
                ...prevOrder,
                ...payload.new,
                user: prevOrder.user,
                order_items:
                  typeof payload.new.order_items === "string"
                    ? JSON.parse(payload.new.order_items)
                    : payload.new.order_items || prevOrder.order_items,
              };

              alert(`Order status updated to ${payload.new.status}`);
              return updatedData;
            });
          }
        )
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [id]);

  const updateOrderStatus = async (newStatus) => {
    if (!order || !newStatus || newStatus === order.status) return;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (error) throw error;

      alert(`Order status updated to ${newStatus}`);
      setEditMode(false);
    } catch (e) {
      console.error("Error updating order status:", e);
      alert(`Failed to update status: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async () => {
    if (!order || order.status === "CANCELLED") return;

    if (window.confirm("Are you sure you want to cancel this order?")) {
      updateOrderStatus("CANCELLED");
    }
  };

  if (loading)
    return (
      <div className="container mx-auto p-4">Loading order details...</div>
    );
  if (error)
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  if (!order)
    return <div className="container mx-auto p-4">Order not found</div>;

  const statusColors = {
    ORDER_PLACED: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-indigo-100 text-indigo-800",
    PREPARING: "bg-yellow-100 text-yellow-800",
    READY_FOR_PICKUP: "bg-orange-100 text-orange-800",
    OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Order Details</h1>

          {editMode ? (
            <div className="flex items-center space-x-2">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                disabled={updating}
                className="border rounded px-2 py-1 text-sm"
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setEditMode(false)}
                className="px-2 py-1 text-xs bg-gray-200 rounded"
              >
                Cancel
              </button>
              {updating && (
                <span className="text-xs text-gray-500">Updating...</span>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[order.status] || "bg-gray-100"
                }`}
              >
                {order.status?.replace(/_/g, " ")}
              </span>
              <button
                onClick={() => setEditMode(true)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-3">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{format(new Date(order.created_at), "PPP p")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span>{order.payment_method || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={
                      order.payment_status === "PAID"
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {order.payment_status || "PENDING"}
                  </span>
                </div>
                {order.tracking_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking ID:</span>
                    <span>{order.tracking_id}</span>
                  </div>
                )}
                {order.reward_points > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reward Points:</span>
                    <span className="text-green-600">
                      +{order.reward_points}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-3">Customer Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span>{order.user?.full_name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{order.user?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span>{order.phone_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="text-right">{order.delivery_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Method:</span>
                  <span>{order.delivery_method || "Standard Delivery"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-3">Order Items</h2>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(order.order_items) &&
                      order.order_items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">
                            <div className="font-medium">{item.name}</div>
                            {item.options && item.options.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {item.options.map((opt) => (
                                  <div key={opt.id}>
                                    {opt.name}: {opt.value}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {order.currency || "UGX"}
                            {item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {order.currency || "UGX"}
                            {(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-3">Order Total</h2>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>
                    {order.currency || "UGX"}
                    {order.total_amount.toFixed(2)}
                  </span>
                </div>
                {order.delivery_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span>
                      {order.currency || "UGX"}
                      {order.delivery_amount.toFixed(2)}
                    </span>
                  </div>
                )}
                {order.vat > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT 18%:</span>
                    <span>
                      {order.currency || "UGX"}
                      {order.vat.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>
                    {order.currency || "UGX"}
                    {order.total_amount_vat.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.delivery_latitude && order.delivery_longitude && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-3">Delivery Location</h2>
              <div className="bg-gray-50 rounded-md p-4 text-sm">
                <p>
                  Coordinates: {order.delivery_latitude},{" "}
                  {order.delivery_longitude}
                </p>
                <p>Address: {order.delivery_address}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-3">Notes & Feedback</h2>
            <div className="bg-gray-50 rounded-md p-4 space-y-4 text-sm">
              {order.order_note && (
                <div>
                  <span className="text-gray-600 block mb-1">Order Note:</span>
                  <p className="italic">{order.order_note}</p>
                </div>
              )}

              {order.order_feedback && (
                <div>
                  <span className="text-gray-600 block mb-1">
                    Customer Feedback:
                  </span>
                  <p className="italic">{order.order_feedback}</p>
                </div>
              )}

              {!order.order_note && !order.order_feedback && (
                <p className="text-gray-500 italic">
                  No notes or feedback provided
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back
            </button>

            <div className="space-x-2">
              {order.status !== "CANCELLED" && (
                <button
                  onClick={cancelOrder}
                  disabled={updating}
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  Cancel Order
                </button>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
