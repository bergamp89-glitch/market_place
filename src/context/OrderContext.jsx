import { createContext, useContext, useEffect, useMemo, useState } from "react";

const OrderContext = createContext();

const STORAGE_KEY = "tealmarket_orders_v1";

function readOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function formatDateTime() {
  const now = new Date();

  return now.toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => readOrders());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      //
    }
  }, [orders]);

  const addOrder = (payload) => {
    const newOrder = {
      id: payload?.id || Date.now(),
      status: payload?.status || "Yangi buyurtma",
      createdAt: payload?.createdAt || formatDateTime(),

      customer: {
        name: payload?.customer?.name || "",
        phone: payload?.customer?.phone || "",
      },

      deliveryAddress: payload?.deliveryAddress || "",
      paymentType: payload?.paymentType || "Naqd",
      cardNumber: payload?.cardNumber || "",

      items: Array.isArray(payload?.items)
        ? payload.items.map((item) => ({
            ...item,
            quantity: Number(item?.quantity || 1),
          }))
        : [],

      totalItems: Number(payload?.totalItems || 0),
      productsPrice: Number(payload?.productsPrice || 0),
      deliveryPrice: Number(payload?.deliveryPrice || 0),
      totalPrice: Number(payload?.totalPrice || 0),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const removeOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: nextStatus,
            }
          : order
      )
    );
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => String(order.id) === String(orderId)) || null;
  };

  const totalOrders = useMemo(() => orders.length, [orders]);

  const value = useMemo(
    () => ({
      orders,
      totalOrders,
      addOrder,
      removeOrder,
      clearOrders,
      updateOrderStatus,
      getOrderById,
    }),
    [orders, totalOrders]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  return useContext(OrderContext);
}