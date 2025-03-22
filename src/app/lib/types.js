// /app/lib/types.js

const OrderStatus = {
  ORDER_PLACED: "ORDER_PLACED",
  PREPARING: "PREPARING",
  READY_FOR_DELIVERY: "READY_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

const PaymentMethod = {
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  MOBILE_PAYMENT: "MOBILE_PAYMENT",
  ONLINE: "ONLINE",
};

const DeliveryMethod = {
  PICKUP: "PICKUP",
  DELIVERY: "DELIVERY",
};

class OrderItem {
  constructor(
    id,
    name,
    quantity,
    price,
    notes = null,
    options = null
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.notes = notes;
    this.options = options;
  }
}

class Order {
  constructor(
    id,
    order_items,
    total_amount,
    delivery_address,
    phone_number,
    created_at,
    delivery_method = null,
    delivery_amount = null,
    status = null,
    delivery_person_id = null,
    user_id = null,
    updated_at = null,
    payment_method = null,
    total_amount_vat = null,
    vat = null,
    order_feedback = null,
    order_note = null,
    delivery_location = null,
    delivery_latitude = null,
    delivery_longitude = null,
    tracking_id = null,
    payment_status = null,
    transaction_id = null,
    currency = null,
    payment_tracking_id = null,
    payment_failure_reason = null,
    payment_confirmed_at = null,
    payment_details = null,
    reward_points = null
  ) {
    this.id = id;
    this.order_items = order_items;
    this.total_amount = total_amount;
    this.delivery_address = delivery_address;
    this.phone_number = phone_number;
    this.created_at = created_at;
    this.delivery_method = delivery_method;
    this.delivery_amount = delivery_amount;
    this.status = status;
    this.delivery_person_id = delivery_person_id;
    this.user_id = user_id;
    this.updated_at = updated_at;
    this.payment_method = payment_method;
    this.total_amount_vat = total_amount_vat;
    this.vat = vat;
    this.order_feedback = order_feedback;
    this.order_note = order_note;
    this.delivery_location = delivery_location;
    this.delivery_latitude = delivery_latitude;
    this.delivery_longitude = delivery_longitude;
    this.tracking_id = tracking_id;
    this.payment_status = payment_status;
    this.transaction_id = transaction_id;
    this.currency = currency;
    this.payment_tracking_id = payment_tracking_id;
    this.payment_failure_reason = payment_failure_reason;
    this.payment_confirmed_at = payment_confirmed_at;
    this.payment_details = payment_details;
    this.reward_points = reward_points;
  }
}

class OrdersResponse {
  constructor(data = null, error = null) {
    this.data = data;
    this.error = error;
  }
}

class OrderResponse {
  constructor(data = null, error = null) {
    this.data = data;
    this.error = error;
  }
}

class DeliveryPerson {
  constructor(id, name, phone, status) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.status = status;
  }
}

module.exports = {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  DeliveryMethod,
  OrderItem,
  Order,
  OrdersResponse,
  OrderResponse,
  DeliveryPerson,
};