import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';
import { TrendingUp, ShoppingBag, Package, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

const AdminDashboard = () => {
  const { orders } = useOrders();
  const { products } = useMenu();

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
  
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase">{title}</p>
        <h3 className="text-xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Dashboard</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Orders" 
          value={orders.length} 
          icon={ShoppingBag} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Orders" 
          value={activeOrders} 
          icon={Package} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Menu Items" 
          value={products.length} 
          icon={TrendingUp} 
          color="bg-purple-500" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
              <div>
                <span className="font-bold block">Order #{order.id}</span>
                <span className="text-xs text-slate-500">{new Date(order.date).toLocaleString()}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                order.status === 'new' ? 'bg-blue-100 text-blue-600' :
                order.status === 'cooking' ? 'bg-orange-100 text-orange-600' :
                order.status === 'delivering' ? 'bg-purple-100 text-purple-600' :
                order.status === 'cancelled' ? 'bg-rose-100 text-rose-600' :
                'bg-green-100 text-green-600'
              }`}>
                {order.status}
              </span>
            </div>
          ))}
          {orders.length === 0 && <p className="text-slate-400 text-sm">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
