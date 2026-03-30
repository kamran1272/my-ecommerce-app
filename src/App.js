import React, { Suspense, lazy } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import ErrorPage from './components/ErrorPage';
import Footer from './components/Footer';
import Header from './components/Header';
import PageLoader from './components/PageLoader';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <ErrorBoundary>
                  <Helmet>
                    <title>Kamran Laptop Hub | Premium Laptops, Gaming Systems, and Accessories</title>
                    <meta
                      name="description"
                      content="Shop premium laptops, creator machines, gaming rigs, and accessories with modern checkout, wishlist, and admin-managed inventory."
                    />
                    <meta
                      name="keywords"
                      content="laptop store, gaming laptops, premium laptops, ecommerce, admin dashboard, cart, wishlist"
                    />
                    <meta property="og:title" content="Kamran Laptop Hub" />
                    <meta
                      property="og:description"
                      content="A professional laptop e-commerce experience with admin-managed inventory and modern shopping flows."
                    />
                  </Helmet>

                  <div className="App flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1" role="main">
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/home" element={<HomePage />} />
                          <Route path="/products" element={<ProductsPage />} />
                          <Route path="/products/:id" element={<ProductDetailsPage />} />
                          <Route path="/search" element={<SearchPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/faq" element={<FAQPage />} />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <ProfilePage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/orders"
                            element={
                              <ProtectedRoute>
                                <OrdersPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute requireAdmin>
                                <AdminDashboardPage />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/privacy" element={<PrivacyPage />} />
                          <Route path="/terms" element={<TermsPage />} />
                          <Route path="/returns" element={<ReturnsPage />} />
                          <Route path="/shipping" element={<ShippingPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                </ErrorBoundary>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
