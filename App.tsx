import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { MenuProvider } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';

const LiveAgent = lazy(() => import('./components/LiveAgent'));
const Menu = lazy(() => import('./pages/Menu'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));

const RouteFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center px-6">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin mb-4" />
      <p className="text-sm font-semibold text-slate-500">Yuklanmoqda...</p>
    </div>
  </div>
);

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-y-auto">
        <div className="flex-1 pb-20 lg:pb-0">
          <Outlet />
          <Footer />
        </div>
        <BottomNav />
        <Suspense fallback={null}>
          <LiveAgent />
        </Suspense>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <MenuProvider>
            <OrderProvider>
              <CartProvider>
                <ToastProvider>
                  <HashRouter>
                    <Suspense fallback={<RouteFallback />}>
                      <Routes>
                        {/* Public App */}
                        <Route path="/" element={<Layout />}>
                          <Route index element={<Home />} />
                          <Route path="menu" element={<Menu />} />
                          <Route path="cart" element={<Cart />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="product/:id" element={<ProductDetails />} />
                        </Route>

                        {/* Admin Panel */}
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<AdminDashboard />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="menu" element={<AdminMenu />} />
                          <Route path="orders" element={<AdminOrders />} />
                        </Route>
                      </Routes>
                    </Suspense>
                  </HashRouter>
                </ToastProvider>
              </CartProvider>
            </OrderProvider>
          </MenuProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
