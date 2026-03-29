import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getOrdersByEmail } from '../services/orderService';
import { APP_EVENTS, subscribeToWindowEvent } from '../services/storageService';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const syncOrders = () => {
      if (!user?.email) {
        setOrders([]);
        return;
      }
      setOrders(getOrdersByEmail(user.email));
    };

    syncOrders();
    const offOrders = subscribeToWindowEvent(APP_EVENTS.ordersChanged, syncOrders);
    const offStorage = subscribeToWindowEvent('storage', syncOrders);
    return () => {
      offOrders();
      offStorage();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="py-16 text-center text-slate-500">
        <i className="bi bi-person-lock mb-3 block text-4xl"></i>
        Please log in to view your orders.
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-800 md:text-4xl">Your Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track your laptop purchases and order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border bg-white py-16 text-center shadow-sm">
            <i className="bi bi-bag mb-4 text-5xl text-slate-300"></i>
            <p className="mb-4 text-slate-500">No orders yet</p>
            <a
              href="/products"
              className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-bold text-blue-600">Order #{order.id}</p>
                    <p className="text-sm text-slate-500">{order.date}</p>
                  </div>

                  <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 border-t pt-4">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col gap-1 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-slate-500">{order.items.length} items</span>
                  <span className="text-lg font-bold text-slate-800">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
