import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const CATEGORIES = ['All', 'bags', 'boxes', 'disposable', 'tape', 'hygiene'];

const Menu = () => {
    const { products } = useMenu();
    const location = useLocation();
    const { t } = useLanguage();

    const [activeCat, setActiveCat] = useState('All');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading for smooth UX
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Handle incoming navigation state (e.g. from Home categories)
    useEffect(() => {
        if (location.state) {
            if (location.state.category) {
                setActiveCat(location.state.category);
            }
            if (location.state.search) {
                setSearch(location.state.search);
            }
        }
    }, [location]);

    const filtered = products.filter(item => {
        const matchesCat = activeCat === 'All' || item.category === activeCat;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const getCategoryName = (cat: string) => {
        switch (cat) {
            case 'All': return 'Barchasi';
            // Bir martalik idishlar
            case 'cups': return 'Stakanlar';
            case 'containers': return 'Konteynerlar';
            case 'plates': return 'Likopchalar';
            case 'cutlery': return 'Qoshiq/Sanchqi';
            case 'accessories': return 'Aksessuarlar';
            // Xo'jalik mollari
            case 'bags': return 'Paketlar';
            case 'kitchen': return 'Oshxona sarflov';
            case 'cleaning': return 'Tozalash';
            case 'hygiene': return 'Gigiena';
            case 'household': return 'Xo\'jalik';
            // Bayram
            case 'party': return 'Bayram';
            default: return cat;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SEO
                title={activeCat === 'All' ? t.menu : getCategoryName(activeCat)}
                description="PaketShop katalogi. Keng turdagi paketlar, qutilar va bir martalik idishlar."
                keywords={`katalog, ${activeCat}, qadoqlash, ulgurji narxlar`}
            />

            {/* Sticky Header Area */}
            <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-30 px-4 md:px-8 py-4 border-b border-slate-200">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900">{t.menu}</h1>

                        {/* Search */}
                        <div className="flex gap-2 w-full md:w-auto md:min-w-[400px]">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={t.searchPlaceholder}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 shadow-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="bg-white px-3 rounded-xl border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50">
                                <SlidersHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCat(cat);
                                    setSearch(''); // Clear search when switching category manually
                                }}
                                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-all border ${activeCat === cat
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200 hover:text-orange-600'
                                    }`}
                            >
                                {getCategoryName(cat)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-grow px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto w-full">
                {isLoading ? (
                    // Skeleton Loading
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                            {filtered.map(item => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Package className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="font-bold text-slate-600 text-lg mb-2">Mahsulot topilmadi</h3>
                                <p className="text-slate-400 text-sm mb-4">Boshqa kategoriyani tanlang yoki qidiruvni o'zgartiring</p>
                                {(activeCat !== 'All' || search) && (
                                    <button
                                        onClick={() => { setActiveCat('All'); setSearch(''); }}
                                        className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors"
                                    >
                                        Barchasini ko'rsatish
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Menu;