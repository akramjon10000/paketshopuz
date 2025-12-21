import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Search, Truck, ShieldCheck, Clock, CreditCard, Star, Package, ShoppingBag, Coffee, Scissors, Droplets } from 'lucide-react';
import AddressModal from '../components/AddressModal';
import SEO from '../components/SEO';

const Home = () => {
    const navigate = useNavigate();
    const { t, lang, setLang } = useLanguage();
    const { currentAddress, setCurrentAddress } = useAuth();
    const { products } = useMenu();
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const popularItems = products.filter(i => i.popular);

    const categories = [
        // Bir martalik idishlar
        { id: 'cups', name: lang === 'ru' ? 'Стаканы' : 'Stakanlar', icon: <Coffee size={32} /> },
        { id: 'containers', name: lang === 'ru' ? 'Контейнеры' : 'Konteynerlar', icon: <Package size={32} /> },
        { id: 'plates', name: lang === 'ru' ? 'Тарелки' : 'Likopchalar', icon: <Coffee size={32} /> },
        { id: 'cutlery', name: lang === 'ru' ? 'Приборы' : 'Qoshiq/Sanchqi', icon: <Scissors size={32} /> },
        { id: 'accessories', name: lang === 'ru' ? 'Аксессуары' : 'Aksessuarlar', icon: <Star size={32} /> },
        // Xo'jalik mollari
        { id: 'bags', name: lang === 'ru' ? 'Пакеты' : 'Paketlar', icon: <ShoppingBag size={32} /> },
        { id: 'kitchen', name: lang === 'ru' ? 'Кухня' : 'Oshxona', icon: <Coffee size={32} /> },
        { id: 'cleaning', name: lang === 'ru' ? 'Уборка' : 'Tozalash', icon: <Droplets size={32} /> },
        { id: 'hygiene', name: lang === 'ru' ? 'Гигиена' : 'Gigiena', icon: <Droplets size={32} /> },
        { id: 'household', name: lang === 'ru' ? 'Хозтовары' : 'Xo\'jalik', icon: <Package size={32} /> },
        // Bayram
        { id: 'party', name: lang === 'ru' ? 'Праздники' : 'Bayram', icon: <Star size={32} /> },
    ];

    // Hamkor brendlar (Mijozlar)
    const brands = [
        { name: 'OshMarkaz', logo: 'https://cdn-icons-png.flaticon.com/512/3214/3214150.png' }, // Generic Food Icon
        { name: 'FastFood', logo: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
        { name: 'CoffeeShop', logo: 'https://cdn-icons-png.flaticon.com/512/2935/2935413.png' },
        { name: 'Market', logo: 'https://cdn-icons-png.flaticon.com/512/3724/3724720.png' },
        { name: 'Bakery', logo: 'https://cdn-icons-png.flaticon.com/512/992/992747.png' },
        { name: 'Delivery', logo: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/menu', { state: { search: searchQuery } });
    };

    const LanguageSwitcher = () => (
        <div className="flex bg-slate-100 p-0.5 rounded-lg">
            {(['uz', 'ru', 'en'] as const).map((l) => (
                <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === l
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    {l}
                </button>
            ))}
        </div>
    );

    return (
        <div className="space-y-10">
            <SEO
                title={t.home}
                description="PaketShop.uz - Biznesingiz uchun qadoqlash mahsulotlari. Paketlar, qutilar, bir martalik idishlar va skotch."
            />

            {/* 1. Header Section with Address & Search */}
            <div className="bg-white border-b border-slate-200 pb-4 pt-4 sticky top-0 z-30 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">

                    {/* Mobile Top Row */}
                    <div className="flex justify-between items-center md:hidden">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-200 shrink-0">
                                <Package size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h1 className="font-black text-slate-900 leading-none text-xl tracking-tighter">PaketShop.uz</h1>
                                <LanguageSwitcher />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border border-slate-200" onClick={() => navigate('/profile')}>
                                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
                            </div>
                        </div>
                    </div>

                    {/* Address Row for Mobile (Below Header) */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsAddressModalOpen(true)}
                            className="flex items-center gap-1 w-full bg-slate-50 p-2 rounded-xl border border-slate-100"
                        >
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm">
                                <Truck size={16} />
                            </div>
                            <div className="flex flex-col items-start ml-2 overflow-hidden">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{t.delivery}</span>
                                <div className="flex items-center gap-1 w-full">
                                    <span className="text-sm font-bold text-slate-900 truncate">{currentAddress.split(',')[0]}</span>
                                    <ChevronDown size={14} className="text-orange-600 shrink-0" />
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Desktop Left Side */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Desktop Lang Switcher */}
                        <LanguageSwitcher />

                        <div className="flex flex-col border-l border-slate-100 pl-6">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{t.delivery}:</span>
                            <button onClick={() => setIsAddressModalOpen(true)} className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                                <span className="font-bold text-slate-900 border-b border-dashed border-slate-300">{currentAddress}</span>
                                <ChevronDown size={16} className="text-orange-600" />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-50/50 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 text-white p-1.5 rounded-xl hover:bg-orange-700 transition-colors">
                            <Search size={16} />
                        </button>
                    </form>

                    <AddressModal
                        isOpen={isAddressModalOpen}
                        onClose={() => setIsAddressModalOpen(false)}
                        onConfirm={(addr) => { setCurrentAddress(addr); setIsAddressModalOpen(false); }}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">

                {/* 2. Hero Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[400px]">
                    {/* Main Big Banner */}
                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer h-[240px] md:h-full bg-slate-900" onClick={() => navigate('/menu')}>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-md text-white">
                            <span className="bg-orange-600 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider mb-3 inline-block animate-pulse">Aksiya</span>
                            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 leading-none">KRAFT PAKETLAR</h2>
                            <p className="text-sm md:text-lg text-slate-200 mb-6 font-medium">Do'koningiz uslubini ekologik toza paketlar bilan yangilang.</p>
                            <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg">Buyurtma berish</button>
                        </div>
                    </div>

                    {/* Side Banners */}
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4 h-full">
                        <div className="relative rounded-3xl overflow-hidden shadow-sm group cursor-pointer bg-slate-100 h-[160px] md:h-auto" onClick={() => navigate('/menu', { state: { category: 'boxes' } })}>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-black text-xl md:text-2xl uppercase">PITSSA QUTILARI</h3>
                                <span className="text-xs font-bold underline">Barchasini ko'rish</span>
                            </div>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden shadow-sm group cursor-pointer bg-slate-100 h-[160px] md:h-auto" onClick={() => navigate('/menu', { state: { category: 'disposable' } })}>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-black text-xl md:text-2xl uppercase">BIR MARTALIK</h3>
                                <span className="text-xs font-bold underline">Oziq-ovqat uchun</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Service Guarantees (Trust Badges) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Truck, title: "Tezkor Yetkazish", desc: "Toshkent bo'ylab" },
                        { icon: ShieldCheck, title: "Sifat Kafolati", desc: "Mustahkam material" },
                        { icon: CreditCard, title: "Qulay To'lov", desc: "Perechislenie, Naqd" },
                        { icon: Clock, title: "Ulgurji Narxlar", desc: "Katta buyurtmaga" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. Category Circles */}
                <div>
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.categories}</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => navigate('/menu', { state: { category: cat.id } })}
                                className="flex flex-col items-center gap-3 min-w-[100px] group"
                            >
                                <div className="w-20 h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-700 shadow-sm group-hover:shadow-md group-hover:border-orange-200 group-hover:scale-110 transition-all">
                                    {cat.icon}
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 5. Best Sellers */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Star className="text-yellow-400 fill-yellow-400" />
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t.popular}</h2>
                        </div>
                        <button onClick={() => navigate('/menu')} className="text-orange-600 font-bold text-sm hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors">
                            {t.seeAll}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {popularItems.map(item => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </div>

                {/* 6. Brands Ticker */}
                <div className="pt-8 border-t border-slate-200">
                    <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Bizning Mijozlar</p>
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {brands.map((brand, idx) => (
                            <img key={idx} src={brand.logo} alt={brand.name} className="h-8 md:h-10 object-contain hover:scale-110 transition-transform cursor-pointer" />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;