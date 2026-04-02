import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

const AdminLayout = () => {
  const { isAdmin, logout } = useAuth();
  const { refreshOrders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/profile');
      return;
    }

    void refreshOrders();
  }, [isAdmin, navigate, refreshOrders]);

  if (!isAdmin) {
    return null;
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 p-3 rounded-xl transition-all font-bold ${
      isActive ? 'bg-orange-600 text-white shadow-md shadow-orange-200' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-40 hidden lg:flex">
        <div className="p-6">
          <h1 className="text-2xl font-black text-orange-600 tracking-tighter hidden lg:block">PaketShop Admin</h1>
          <h1 className="text-2xl font-black text-orange-600 tracking-tighter lg:hidden">PS</h1>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <NavLink to="/admin/dashboard" className={navClass}>
            <LayoutDashboard size={20} /> <span className="hidden lg:block">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/menu" className={navClass}>
            <Package size={20} /> <span className="hidden lg:block">Mahsulotlar</span>
          </NavLink>
          <NavLink to="/admin/orders" className={navClass}>
            <ClipboardList size={20} /> <span className="hidden lg:block">Buyurtmalar</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={() => navigate('/')} className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 p-2 w-full">
            <Home size={20} /> <span className="hidden lg:block">App ga qaytish</span>
          </button>
          <button onClick={logout} className="flex items-center space-x-3 text-red-600 hover:text-red-800 p-2 w-full mt-2">
            <LogOut size={20} /> <span className="hidden lg:block">Chiqish</span>
          </button>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-2 pb-safe">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'text-orange-600' : 'text-slate-400'}`}><LayoutDashboard /></NavLink>
        <NavLink to="/admin/menu" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'text-orange-600' : 'text-slate-400'}`}><Package /></NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'text-orange-600' : 'text-slate-400'}`}><ClipboardList /></NavLink>
        <button onClick={() => navigate('/')} className="p-2 text-slate-400"><Home /></button>
      </div>

      <div className="flex-grow lg:ml-64 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
