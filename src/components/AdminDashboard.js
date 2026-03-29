import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { listUsers } from '../services/authService';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { createProduct, deleteProduct, getProducts, resetProducts, updateProduct } from '../services/productService';
import { APP_EVENTS, subscribeToWindowEvent } from '../services/storageService';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PRODUCT_TEMPLATE = {
  name: '',
  brand: '',
  category: 'Laptops',
  price: '',
  oldPrice: '',
  stock: '',
  image: '',
  description: '',
  rating: '4.5',
  cpu: '',
  ram: '',
  storage: '',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);

const formatStatusLabel = (status) =>
  String(status || 'pending').replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeOrderStatus = (status) => {
  const normalized = String(status || 'pending').toLowerCase();
  if (normalized === 'confirmed') return 'processing';
  return ORDER_STATUSES.includes(normalized) ? normalized : 'pending';
};

const mapProductToForm = (product) => ({
  name: product.name || '',
  brand: product.brand || '',
  category: product.category || 'Laptops',
  price: product.price ?? '',
  oldPrice: product.oldPrice ?? '',
  stock: product.stock ?? '',
  image: product.image || '',
  description: product.description || '',
  rating: product.rating ?? '4.5',
  cpu: product.specs?.cpu || '',
  ram: product.specs?.ram || '',
  storage: product.specs?.storage || '',
});

const buildProductPayload = (form) => ({
  name: form.name,
  brand: form.brand,
  category: form.category,
  description: form.description,
  image: form.image,
  price: form.price,
  oldPrice: form.oldPrice,
  stock: form.stock,
  rating: form.rating,
  specs: {
    cpu: form.cpu,
    ram: form.ram,
    storage: form.storage,
  },
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(PRODUCT_TEMPLATE);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isResettingCatalog, setIsResettingCatalog] = useState(false);

  useEffect(() => {
    const syncDashboard = () => {
      setProducts(getProducts());
      setOrders(getOrders());
      setUsers(listUsers());
    };

    syncDashboard();

    const offProducts = subscribeToWindowEvent(APP_EVENTS.productsChanged, syncDashboard);
    const offOrders = subscribeToWindowEvent(APP_EVENTS.ordersChanged, syncDashboard);
    const offStorage = subscribeToWindowEvent('storage', syncDashboard);

    return () => {
      offProducts();
      offOrders();
      offStorage();
    };
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const inventoryUnits = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0);
    const lowStock = products.filter((product) => Number(product.stock) <= 5).length;
    const pendingOrders = orders.filter((order) => !['delivered', 'cancelled'].includes(normalizeOrderStatus(order.status))).length;

    return {
      totalRevenue,
      inventoryUnits,
      lowStock,
      pendingOrders,
      products: products.length,
      orders: orders.length,
      users: users.length,
    };
  }, [orders, products, users]);

  const lowStockProducts = useMemo(
    () => [...products].filter((product) => Number(product.stock) <= 5).sort((left, right) => Number(left.stock) - Number(right.stock)),
    [products]
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setProductForm((current) => ({ ...current, [name]: value }));
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm(PRODUCT_TEMPLATE);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm(mapProductToForm(product));
    setActiveTab('catalog');
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();

    if (!productForm.name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    if (!productForm.price) {
      showToast('Product price is required.', 'error');
      return;
    }

    setIsSavingProduct(true);

    try {
      const payload = buildProductPayload(productForm);
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        showToast('Product updated successfully.', 'success');
      } else {
        await createProduct(payload);
        showToast('Product created successfully.', 'success');
      }
      resetProductForm();
    } catch (error) {
      showToast(error.message || 'Unable to save product.', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      if (editingProductId === productId) resetProductForm();
      showToast('Product deleted successfully.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to delete product.', 'error');
    }
  };

  const handleResetCatalog = async () => {
    setIsResettingCatalog(true);
    try {
      await resetProducts();
      resetProductForm();
      showToast('Default product catalog restored.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to reset catalog.', 'error');
    } finally {
      setIsResettingCatalog(false);
    }
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      showToast('Order status updated.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to update order status.', 'error');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await readFileAsDataUrl(file);
      setProductForm((current) => ({ ...current, image }));
      showToast('Product image added.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to upload image.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">Admin control center</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">Store operations dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Monitor inventory, orders, and customer accounts from a cleaner admin workspace built on the new services layer.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Signed in as</p>
              <p className="mt-2 text-lg font-bold text-white">{user?.name || 'Admin'}</p>
              <p className="text-sm text-slate-300">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-blue-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Revenue</p>
              <p className="mt-3 text-3xl font-black text-white">{formatCurrency(stats.totalRevenue)}</p>
              <p className="mt-2 text-sm text-slate-300">{stats.orders} total orders processed</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-emerald-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Catalog</p>
              <p className="mt-3 text-3xl font-black text-white">{stats.products}</p>
              <p className="mt-2 text-sm text-slate-300">{stats.inventoryUnits} units currently in stock</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-violet-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Customers</p>
              <p className="mt-3 text-3xl font-black text-white">{stats.users}</p>
              <p className="mt-2 text-sm text-slate-300">{stats.pendingOrders} orders still need action</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-amber-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Attention</p>
              <p className="mt-3 text-3xl font-black text-white">{stats.lowStock}</p>
              <p className="mt-2 text-sm text-slate-300">Products currently at low stock</p>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
              <div className="flex flex-wrap gap-3">
                {[{ id: 'overview', label: 'Overview' }, { id: 'catalog', label: 'Catalog' }, { id: 'orders', label: 'Orders' }, { id: 'users', label: 'Users' }].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5">
                    <h2 className="text-xl font-bold text-white">Low stock watchlist</h2>
                    <div className="mt-5 space-y-3">
                      {lowStockProducts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-400">Inventory looks healthy right now.</div>
                      ) : (
                        lowStockProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
                            <div>
                              <p className="font-semibold text-white">{product.name}</p>
                              <p className="text-sm text-slate-400">{product.brand}</p>
                            </div>
                            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-200">{product.stock} left</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5">
                    <h2 className="text-xl font-bold text-white">Recent orders</h2>
                    <div className="mt-5 space-y-3">
                      {recentOrders.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-400">No orders recorded yet.</div>
                      ) : (
                        recentOrders.map((order) => (
                          <div key={order.id} className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-white">#{order.id}</p>
                              <span className="text-sm font-semibold text-blue-200">{formatCurrency(order.total)}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-300">{order.email || 'No email provided'}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{formatStatusLabel(normalizeOrderStatus(order.status))}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'catalog' && (
                <div className="mt-6 space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Product catalog</h2>
                      <p className="mt-1 text-sm text-slate-400">Manage store inventory, pricing, and product content from one place.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={resetProductForm} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">New product</button>
                      <button type="button" onClick={handleResetCatalog} disabled={isResettingCatalog} className="rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60">{isResettingCatalog ? 'Restoring...' : 'Restore defaults'}</button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-800">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-800 text-left">
                        <thead className="bg-slate-950/80">
                          <tr>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Product</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Brand</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Price</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Stock</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                          {products.map((product) => (
                            <tr key={product.id} className="transition hover:bg-slate-800/70">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={product.image || `${process.env.PUBLIC_URL}/logo.png`} alt={product.name} className="h-12 w-12 rounded-xl border border-slate-700 object-cover" />
                                  <div className="min-w-0">
                                    <p className="truncate font-semibold text-white">{product.name}</p>
                                    <p className="truncate text-sm text-slate-400">{product.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-300">{product.brand}</td>
                              <td className="px-4 py-4 text-sm font-semibold text-slate-100">{formatCurrency(product.price)}</td>
                              <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${Number(product.stock) <= 5 ? 'bg-amber-500/15 text-amber-200' : 'bg-emerald-500/15 text-emerald-200'}`}>{product.stock} units</span></td>
                              <td className="px-4 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => handleEditProduct(product)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-blue-400 hover:text-white">Edit</button><button type="button" onClick={() => handleDeleteProduct(product.id)} className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/10">Delete</button></div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Order management</h2>
                    <p className="mt-1 text-sm text-slate-400">Track fulfillment and update order progress.</p>
                  </div>

                  <div className="grid gap-4">
                    {orders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center text-slate-400">No orders yet. Orders placed during checkout will appear here.</div>
                    ) : (
                      orders.map((order) => (
                        <article key={order.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-bold text-white">Order #{order.id}</h3>
                                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">{formatStatusLabel(normalizeOrderStatus(order.status))}</span>
                              </div>
                              <p className="text-sm text-slate-300">{order.email || 'No email provided'}</p>
                              <p className="text-sm text-slate-400">{order.date || 'Date unavailable'} - {order.items?.length || 0} items - {formatCurrency(order.total)}</p>
                            </div>

                            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-300">
                              Update status
                              <select value={normalizeOrderStatus(order.status)} onChange={(event) => handleStatusChange(order.id, event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white focus:border-blue-400 focus:outline-none">
                                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{formatStatusLabel(status)}</option>)}
                              </select>
                            </label>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">User management</h2>
                    <p className="mt-1 text-sm text-slate-400">Review the currently registered accounts from the auth layer.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {users.map((storedUser) => (
                      <article key={storedUser.email} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-bold text-white">{storedUser.name || 'Unnamed User'}</h3>
                            <p className="mt-1 break-all text-sm text-slate-300">{storedUser.email}</p>
                          </div>
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">{storedUser.role || 'user'}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{editingProductId ? 'Edit product' : 'Add product'}</h2>
                  <p className="mt-1 text-sm text-slate-400">Keep your product data clean, reusable, and backend-ready.</p>
                </div>
                {editingProductId && <button type="button" onClick={resetProductForm} className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800">Cancel edit</button>}
              </div>

              <form onSubmit={handleSubmitProduct} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Product name</span><input type="text" name="name" value={productForm.name} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="Lenovo Legion Pro 7" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Brand</span><input type="text" name="brand" value={productForm.brand} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="Lenovo" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Category</span><input type="text" name="category" value={productForm.category} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="Gaming" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Rating</span><input type="number" step="0.1" min="0" max="5" name="rating" value={productForm.rating} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Price</span><input type="number" step="0.01" min="0" name="price" value={productForm.price} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="1899.99" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Old price</span><input type="number" step="0.01" min="0" name="oldPrice" value={productForm.oldPrice} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="2099.99" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Stock</span><input type="number" min="0" name="stock" value={productForm.stock} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="18" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">CPU</span><input type="text" name="cpu" value={productForm.cpu} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="Intel Core Ultra 9" /></label>
                  <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">RAM</span><input type="text" name="ram" value={productForm.ram} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="32GB" /></label>
                  <label className="space-y-2 sm:col-span-2"><span className="text-sm font-semibold text-slate-300">Storage</span><input type="text" name="storage" value={productForm.storage} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="1TB SSD" /></label>
                </div>

                <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Image URL</span><input type="url" name="image" value={productForm.image} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="https://example.com/laptop.jpg" /></label>
                <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Upload image</span><input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-400" /></label>
                <label className="space-y-2"><span className="text-sm font-semibold text-slate-300">Description</span><textarea name="description" rows="4" value={productForm.description} onChange={handleFormChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none" placeholder="Describe the laptop, its audience, and standout features." /></label>

                {productForm.image && <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"><img src={productForm.image} alt="Product preview" className="h-48 w-full object-cover" /></div>}

                <button type="submit" disabled={isSavingProduct} className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">{isSavingProduct ? 'Saving product...' : editingProductId ? 'Update product' : 'Create product'}</button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
