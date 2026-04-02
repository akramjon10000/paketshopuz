import React from 'react';
import {
  CreditCard,
  Loader2,
  MapPin,
  MessageSquareText,
  PackageSearch,
  Phone,
  RefreshCw,
  Search,
  UserRound,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../components/Toast';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/format';

const STATUS_META: Record<Order['status'], { label: string; badgeClass: string; buttonClass: string }> = {
  new: {
    label: 'Yangi',
    badgeClass: 'bg-blue-100 text-blue-700',
    buttonClass: 'hover:border-blue-200 hover:text-blue-600',
  },
  cooking: {
    label: 'Tayyorlanmoqda',
    badgeClass: 'bg-orange-100 text-orange-700',
    buttonClass: 'hover:border-orange-200 hover:text-orange-600',
  },
  delivering: {
    label: 'Yetkazilmoqda',
    badgeClass: 'bg-violet-100 text-violet-700',
    buttonClass: 'hover:border-violet-200 hover:text-violet-600',
  },
  completed: {
    label: 'Yakunlandi',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    buttonClass: 'hover:border-emerald-200 hover:text-emerald-600',
  },
  cancelled: {
    label: 'Bekor qilingan',
    badgeClass: 'bg-rose-100 text-rose-700',
    buttonClass: 'hover:border-rose-200 hover:text-rose-600',
  },
};

const PAYMENT_LABELS: Record<Order['paymentMethod'], string> = {
  cash: 'Naqd',
  click: 'Click',
  payme: 'Payme',
};

const STATUS_FILTERS: Array<{
  id: 'all' | 'active' | Order['status'];
  label: string;
  match: (order: Order) => boolean;
}> = [
  {
    id: 'all',
    label: 'Barchasi',
    match: () => true,
  },
  {
    id: 'active',
    label: 'Faol',
    match: (order) => ['new', 'cooking', 'delivering'].includes(order.status),
  },
  {
    id: 'new',
    label: 'Yangi',
    match: (order) => order.status === 'new',
  },
  {
    id: 'completed',
    label: 'Yakunlangan',
    match: (order) => order.status === 'completed',
  },
  {
    id: 'cancelled',
    label: 'Bekor qilingan',
    match: (order) => order.status === 'cancelled',
  },
];

const STATUS_OPTIONS: Order['status'][] = ['new', 'cooking', 'delivering', 'completed', 'cancelled'];

const AdminOrders = () => {
  const { orders, updateOrderStatus, refreshOrders } = useOrders();
  const { showToast } = useToast();
  const [search, setSearch] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'active' | Order['status']>('all');
  const [refreshing, setRefreshing] = React.useState(false);
  const [updatingOrderId, setUpdatingOrderId] = React.useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const filter = STATUS_FILTERS.find((item) => item.id === selectedFilter);
    const matchesFilter = filter ? filter.match(order) : true;

    if (!matchesFilter) {
      return false;
    }

    const query = search.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const searchableText = [
      order.id,
      order.customerName,
      order.phone,
      order.address,
      order.comment,
      PAYMENT_LABELS[order.paymentMethod],
      ...order.items.map((item) => item.name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  const activeOrdersCount = orders.filter((order) => ['new', 'cooking', 'delivering'].includes(order.status)).length;
  const completedOrdersCount = orders.filter((order) => order.status === 'completed').length;
  const cancelledOrdersCount = orders.filter((order) => order.status === 'cancelled').length;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
      showToast('Buyurtmalar yangilandi', 'info');
    } catch {
      showToast('Buyurtmalarni yangilab bo‘lmadi', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      showToast(`Status "${STATUS_META[status].label}" ga o‘zgartirildi`);
    } catch {
      showToast('Statusni yangilashda xatolik yuz berdi', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(`${label} nusxalandi`, 'info');
    } catch {
      showToast(`${label}ni nusxalab bo‘lmadi`, 'error');
    }
  };

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => { void handleCopy(order.id, 'Buyurtma ID'); }}
              className="text-left font-black text-lg text-slate-900 hover:text-orange-600 transition-colors"
            >
              #{order.id}
            </button>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_META[order.status].badgeClass}`}>
              {STATUS_META[order.status].label}
            </span>
          </div>
          <p className="text-xs text-slate-400">{new Date(order.date).toLocaleString()}</p>
        </div>
        <div className="text-left lg:text-right">
          <p className="text-xs font-bold uppercase text-slate-400">Jami summa</p>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
            <UserRound size={14} />
            Mijoz
          </div>
          <p className="font-semibold text-slate-900">{order.customerName || 'Ism ko‘rsatilmagan'}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
            <CreditCard size={14} />
            To‘lov turi
          </div>
          <p className="font-semibold text-slate-900">{PAYMENT_LABELS[order.paymentMethod]}</p>
        </div>
        <button
          type="button"
          onClick={() => { void handleCopy(order.phone, 'Telefon'); }}
          className="bg-slate-50 rounded-xl p-3 text-left hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
            <Phone size={14} />
            Telefon
          </div>
          <p className="font-semibold text-slate-900">{order.phone}</p>
        </button>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase mb-1">
            <MapPin size={14} />
            Manzil
          </div>
          <p className="font-semibold text-slate-900">{order.address}</p>
        </div>
      </div>

      {order.comment && (
        <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase mb-1">
            <MessageSquareText size={14} />
            Izoh
          </div>
          <p className="text-sm text-slate-700">{order.comment}</p>
        </div>
      )}

      <div className="bg-slate-50 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase text-slate-500">Tarkib</p>
          <p className="text-xs text-slate-400">{order.items.length} ta mahsulot turi</p>
        </div>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-700">{item.quantity}x {item.name}</span>
              <span className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => { void handleStatusChange(order.id, status); }}
            disabled={order.status === status || updatingOrderId === order.id}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              order.status === status
                ? 'bg-slate-900 text-white border-slate-900'
                : `bg-white text-slate-600 border-slate-200 ${STATUS_META[status].buttonClass}`
            } ${updatingOrderId === order.id ? 'opacity-70 cursor-wait' : ''}`}
          >
            {STATUS_META[status].label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Buyurtmalar</h2>
          <p className="text-slate-500 text-sm">Qidirish, filtrlash va statuslarni bir joydan boshqaring.</p>
        </div>
        <button
          type="button"
          onClick={() => { void handleRefresh(); }}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-70"
        >
          {refreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Yangilash
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Jami buyurtmalar</p>
          <p className="text-3xl font-black text-slate-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Faol buyurtmalar</p>
          <p className="text-3xl font-black text-orange-600">{activeOrdersCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Yakunlangan</p>
          <p className="text-3xl font-black text-emerald-600">{completedOrdersCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Bekor qilingan</p>
          <p className="text-3xl font-black text-rose-600">{cancelledOrdersCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ID, telefon, ism, manzil yoki mahsulot bo‘yicha qidiring"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => {
            const count = orders.filter(filter.match).length;
            const isActive = selectedFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <PackageSearch size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="font-bold text-slate-700 mb-1">Mos buyurtma topilmadi</p>
          <p className="text-sm text-slate-500">Qidiruv so‘zini yoki filtrni o‘zgartirib ko‘ring.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
