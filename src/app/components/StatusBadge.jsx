// /app/components/StatusBadge.js
import { getStatusColor, getPaymentStatusColor } from "../lib/utils";

export function OrderStatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(
        status
      )}`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

export function PaymentStatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getPaymentStatusColor(
        status
      )}`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}