import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { useMenu } from '../context/MenuContext';

const CATEGORY_NAMES: Record<string, string> = {
  All: 'Barchasi',
  cups: 'Stakanlar',
  containers: 'Konteynerlar',
  plates: 'Likopchalar',
  cutlery: 'Qoshiq/Sanchqi',
  accessories: 'Aksessuarlar',
  bags: 'Paketlar',
  boxes: 'Qutilar',
  disposable: 'Bir martalik',
  tape: 'Skotch',
  kitchen: 'Oshxona sarflov',
  cleaning: 'Tozalash',
  hygiene: 'Gigiena',
  household: 'Xo‘jalik',
  party: 'Bayram',
};

const CATEGORY_PRIORITY = [
  'bags',
  'boxes',
  'disposable',
  'tape',
  'hygiene',
  'cups',
  'containers',
  'plates',
  'cutlery',
  'accessories',
  'kitchen',
  'cleaning',
  'household',
  'party',
];

const Menu = () => {
  const { products } = useMenu();
  const location = useLocation();
  const { t } = useLanguage();

  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      setActiveCat(location.state.category);
    }
    if (location.state?.search) {
      setSearch(location.state.search);
    }
  }, [location]);

  const categories = [
    'All',
    ...CATEGORY_PRIORITY.filter((category) => products.some((product) => product.category === category)),
  ];

  const filtered = products.filter((item) => {
    const matchesCat = activeCat === 'All' || item.category === activeCat;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryName = (category: string) => CATEGORY_NAMES[category] || category;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO
        title={activeCat === 'All' ? t.menu : getCategoryName(activeCat)}
        description="PaketShop katalogi. Keng turdagi paketlar, qutilar va bir martalik idishlar."
        keywords={`katalog, ${activeCat}, qadoqlash, ulgurji narxlar`}
      />

      <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-30 px-4 md:px-8 py-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900">{t.menu}</h1>

            <div className="flex gap-2 w-full md:w-auto md:min-w-[400px]">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 shadow-sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <button className="bg-white px-3 rounded-xl border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50">
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCat(category);
                  setSearch('');
                }}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-all border ${
                  activeCat === category
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200 hover:text-orange-600'
                }`}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-grow px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {filtered.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-600 text-lg mb-2">Mahsulot topilmadi</h3>
                <p className="text-slate-400 text-sm mb-4">Boshqa kategoriyani tanlang yoki qidiruvni o‘zgartiring</p>
                {(activeCat !== 'All' || search) && (
                  <button
                    onClick={() => {
                      setActiveCat('All');
                      setSearch('');
                    }}
                    className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors"
                  >
                    Barchasini ko‘rsatish
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
