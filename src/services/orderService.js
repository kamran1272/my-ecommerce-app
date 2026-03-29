import { APP_EVENTS, dispatchAppEvent, readJson, writeJson } from './storageService';

const ORDERS_KEY = 'admin_orders';

const saveOrders = (orders) => {
  writeJson(ORDERS_KEY, orders);
  dispatchAppEvent(APP_EVENTS.ordersChanged, orders);
  return orders;
};

export const getOrders = () => readJson(ORDERS_KEY, []);

export const getOrdersByEmail = (email) =>
  getOrders().filter((order) => order.email?.toLowerCase() === email?.toLowerCase());

export const createOrder = async (order) => {
  const nextOrder = {
    id: order.id || Math.floor(Math.random() * 1_000_000),
    date: order.date || new Date().toLocaleString(),
    status: order.status || 'pending',
    ...order,
  };
  return saveOrders([nextOrder, ...getOrders()]);
};

export const updateOrderStatus = async (orderId, status) => {
  const orders = getOrders().map((order) =>
    Number(order.id) === Number(orderId) ? { ...order, status } : order
  );
  return saveOrders(orders);
};
