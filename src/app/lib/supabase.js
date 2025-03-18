// Sample mock function for getting orders

export async function getOrders() {
  // In a real app, this would fetch from Supabase or another database
  // For now, we'll return mock data
  return {
    data: [
      {
        id: "ORD-001",
        customer_name: "John Doe",
        created_at: "2025-03-15T10:30:00Z",
        status: "completed",
        total_amount_vat: 35000,
      },
      {
        id: "ORD-002",
        customer_name: "Jane Smith",
        created_at: "2025-03-15T11:45:00Z",
        status: "pending",
        total_amount_vat: 42500,
      },
      {
        id: "ORD-003",
        customer_name: "Michael Brown",
        created_at: "2025-03-14T15:20:00Z",
        status: "completed",
        total_amount_vat: 28000,
      },
      {
        id: "ORD-004",
        customer_name: "Sarah Johnson",
        created_at: "2025-03-14T09:15:00Z",
        status: "pending",
        total_amount_vat: 65000,
      },
      {
        id: "ORD-005",
        customer_name: "David Wilson",
        created_at: "2025-03-13T16:40:00Z",
        status: "completed",
        total_amount_vat: 47500,
      },
      {
        id: "ORD-006",
        customer_name: "Emily Davis",
        created_at: "2025-03-13T14:10:00Z",
        status: "completed",
        total_amount_vat: 38000,
      },
    ],
    error: null,
  };
}
