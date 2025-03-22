// app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Adjust path if needed

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = createClient();

    // Fetch single order by ID
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch order from database" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Process order_items field
    let orderItems = order.order_items;

    if (typeof orderItems === "string") {
      try {
        orderItems = JSON.parse(orderItems);
      } catch (e) {
        console.error(`Error parsing order_items for order ${order.id}:`, e);
        orderItems = [];
      }
    }

    if (!Array.isArray(orderItems)) {
      orderItems = [];
    }

    const processedOrder = {
      ...order,
      order_items: orderItems,
    };

    return NextResponse.json(processedOrder, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order data" },
      { status: 500 }
    );
  }
}
