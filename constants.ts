import { Product } from './types';

// ============================================
// KATEGORIYALAR TARTIBI
// ============================================
// 1. BIR MARTALIK IDISHLAR: cups, containers, plates, cutlery, accessories
// 2. XO'JALIK MOLLARI: bags, kitchen, cleaning, hygiene, household
// 3. BAYRAM: party
// ============================================

export const CATEGORIES = {
  cups: { uz: 'Stakanlar', ru: 'Стаканы' },
  containers: { uz: 'Konteynerlar', ru: 'Контейнеры' },
  plates: { uz: 'Likopchalar', ru: 'Тарелки' },
  cutlery: { uz: 'Oshxona anjomlari', ru: 'Столовые приборы' },
  accessories: { uz: 'Aksessuarlar', ru: 'Аксессуары' },
  bags: { uz: 'Paketlar', ru: 'Пакеты' },
  kitchen: { uz: 'Oshxona sarflov', ru: 'Расходные материалы' },
  cleaning: { uz: 'Tozalash inventari', ru: 'Инвентарь для уборки' },
  hygiene: { uz: 'Qog\'oz gigiena', ru: 'Бумажная гигиена' },
  household: { uz: 'Xo\'jalik buyumlari', ru: 'Хозтовары' },
  party: { uz: 'Tug\'ilgan kun va Bayram', ru: 'Праздники' },
};

export const MENU_ITEMS: Product[] = [
  // =======================================
  // === 1. STAKANLAR (CUPS) ===
  // =======================================
  {
    id: 'cup1',
    name: 'Qog\'oz stakan 250ml (50 dona)',
    nameRu: 'Бумажный стакан 250мл (50 шт)',
    description: 'Issiq ichimliklar uchun sifatli qog\'oz stakanlar. Kofe, choy uchun ideal.',
    descriptionRu: 'Качественные бумажные стаканы для горячих напитков. Идеально для кофе и чая.',
    price: 25000,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'],
    category: 'cups',
    subcategory: 'paper',
    popular: true,
  },
  {
    id: 'cup2',
    name: 'Qog\'oz stakan 350ml (50 dona)',
    nameRu: 'Бумажный стакан 350мл (50 шт)',
    description: 'Katta hajmli qog\'oz stakanlar. Latte, kapuchino uchun.',
    descriptionRu: 'Большие бумажные стаканы для латте и капучино.',
    price: 32000,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600'],
    category: 'cups',
    subcategory: 'paper',
  },
  {
    id: 'cup3',
    name: 'Plastik stakan 200ml (100 dona)',
    nameRu: 'Пластиковый стакан 200мл (100 шт)',
    description: 'Shaffof plastik stakanlar. Sovuq ichimliklar uchun.',
    descriptionRu: 'Прозрачные пластиковые стаканы для холодных напитков.',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600'],
    category: 'cups',
    subcategory: 'plastic',
  },
  {
    id: 'cup4',
    name: 'Gumbazli stakan 400ml (50 dona)',
    nameRu: 'Купольный стакан 400мл (50 шт)',
    description: 'Gumbaz qopqoqli stakanlar. Kokteyl, smoothie uchun.',
    descriptionRu: 'Стаканы с купольной крышкой для коктейлей и смузи.',
    price: 45000,
    images: ['https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=600'],
    category: 'cups',
    subcategory: 'dome',
    popular: true,
  },

  // =======================================
  // === 2. KONTEYNERLAR (CONTAINERS) ===
  // =======================================
  {
    id: 'cont1',
    name: 'Plastik konteyner 500ml (50 dona)',
    nameRu: 'Пластиковый контейнер 500мл (50 шт)',
    description: 'Yopiq qopqoqli konteyner. Salat, garnir uchun.',
    descriptionRu: 'Контейнер с крышкой для салатов и гарниров.',
    price: 35000,
    images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=600'],
    category: 'containers',
    subcategory: 'plastic',
    popular: true,
  },
  {
    id: 'cont2',
    name: 'Lanchboks 3 bo\'limli (25 dona)',
    nameRu: 'Ланч-бокс 3 секции (25 шт)',
    description: 'Ko\'p bo\'limli ovqat idishi. Biznes lanch uchun.',
    descriptionRu: 'Многосекционный контейнер для бизнес-ланчей.',
    price: 55000,
    images: ['https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600'],
    category: 'containers',
    subcategory: 'lunchbox',
    popular: true,
  },
  {
    id: 'cont3',
    name: 'Alyuminiy forma 800ml (50 dona)',
    nameRu: 'Алюминиевая форма 800мл (50 шт)',
    description: 'Pishirish va yetkazib berish uchun alyuminiy idishlar.',
    descriptionRu: 'Алюминиевые формы для выпечки и доставки.',
    price: 42000,
    images: ['https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&q=80&w=600'],
    category: 'containers',
    subcategory: 'aluminum',
  },
  {
    id: 'cont4',
    name: 'Sous idishi 50ml (100 dona)',
    nameRu: 'Соусник 50мл (100 шт)',
    description: 'Kichik sous idishlari. Qopqoqli.',
    descriptionRu: 'Маленькие соусники с крышкой.',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&q=80&w=600'],
    category: 'containers',
    subcategory: 'sauce',
  },

  // =======================================
  // === 3. LIKOPCHALAR (PLATES) ===
  // =======================================
  {
    id: 'plate1',
    name: 'Plastik likopcha 22sm (50 dona)',
    nameRu: 'Пластиковая тарелка 22см (50 шт)',
    description: 'Oq rangli plastik likopchalar. Bayram uchun.',
    descriptionRu: 'Белые пластиковые тарелки для праздников.',
    price: 22000,
    images: ['https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&q=80&w=600'],
    category: 'plates',
    subcategory: 'plastic',
  },
  {
    id: 'plate2',
    name: 'Qog\'oz likopcha 18sm (100 dona)',
    nameRu: 'Бумажная тарелка 18см (100 шт)',
    description: 'Ekologik toza qog\'oz likopchalar.',
    descriptionRu: 'Экологичные бумажные тарелки.',
    price: 28000,
    images: ['https://images.unsplash.com/photo-1563826904577-6b72c5d75e53?auto=format&fit=crop&q=80&w=600'],
    category: 'plates',
    subcategory: 'paper',
    popular: true,
  },
  {
    id: 'plate3',
    name: 'Kosa / Chuqur likopcha 500ml (50 dona)',
    nameRu: 'Миска 500мл (50 шт)',
    description: 'Sho\'rva, salat uchun chuqur idishlar.',
    descriptionRu: 'Глубокие миски для супов и салатов.',
    price: 32000,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'],
    category: 'plates',
    subcategory: 'bowl',
  },

  // =======================================
  // === 4. OSHXONA ANJOMLARI (CUTLERY) ===
  // =======================================
  {
    id: 'cut1',
    name: 'Plastik qoshiq (100 dona)',
    nameRu: 'Пластиковые ложки (100 шт)',
    description: 'Bir martalik plastik qoshiqlar.',
    descriptionRu: 'Одноразовые пластиковые ложки.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=600'],
    category: 'cutlery',
  },
  {
    id: 'cut2',
    name: 'Plastik sanchqi (100 dona)',
    nameRu: 'Пластиковые вилки (100 шт)',
    description: 'Bir martalik plastik sanchqilar (vilkalar).',
    descriptionRu: 'Одноразовые пластиковые вилки.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=600'],
    category: 'cutlery',
  },
  {
    id: 'cut3',
    name: 'Qoshiq-sanchqi to\'plam (50 dona)',
    nameRu: 'Набор ложка-вилка (50 шт)',
    description: 'Qoshiq va sanchqi komplekti. Yetkazib berish uchun.',
    descriptionRu: 'Набор ложка и вилка для доставки.',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1556909172-8c2f041fca1e?auto=format&fit=crop&q=80&w=600'],
    category: 'cutlery',
    popular: true,
  },
  {
    id: 'cut4',
    name: 'Aralashtirgichlar / Meshalka (500 dona)',
    nameRu: 'Размешиватели (500 шт)',
    description: 'Kofe va choy uchun aralashtirgich tayoqchalar.',
    descriptionRu: 'Палочки для размешивания кофе и чая.',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=600'],
    category: 'cutlery',
  },

  // =======================================
  // === 5. AKSESSUARLAR (ACCESSORIES) ===
  // =======================================
  {
    id: 'acc1',
    name: 'Ichimlik naychasi (200 dona)',
    nameRu: 'Трубочки для напитков (200 шт)',
    description: 'Rangli plastik naychalar. Kokteyl uchun.',
    descriptionRu: 'Цветные пластиковые трубочки для коктейлей.',
    price: 10000,
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca3e8e?auto=format&fit=crop&q=80&w=600'],
    category: 'accessories',
  },
  {
    id: 'acc2',
    name: 'Stakan ushlagich / Kapholder (50 dona)',
    nameRu: 'Держатель для стаканов (50 шт)',
    description: '2-4 ta stakan uchun karton ushlagichlar.',
    descriptionRu: 'Картонные держатели на 2-4 стакана.',
    price: 20000,
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600'],
    category: 'accessories',
    popular: true,
  },

  // =======================================
  // === 6. PAKETLAR (BAGS) ===
  // =======================================
  {
    id: 'bag1',
    name: 'Mayka paket (Qora) 20kg (50 dona)',
    nameRu: 'Пакет майка (Чёрный) 20кг (50 шт)',
    description: 'Mustahkam qora mayka paketlar. Katta yuklar uchun.',
    descriptionRu: 'Прочные чёрные пакеты-майка для больших нагрузок.',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600'],
    category: 'bags',
    subcategory: 'mayka',
    popular: true,
  },
  {
    id: 'bag2',
    name: 'Mayka paket (Oq) 10kg (100 dona)',
    nameRu: 'Пакет майка (Белый) 10кг (100 шт)',
    description: 'Oq rangli mayka paketlar. O\'rta yuklar uchun.',
    descriptionRu: 'Белые пакеты-майка для средних нагрузок.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1610557892470-55d587c7e0bf?auto=format&fit=crop&q=80&w=600'],
    category: 'bags',
    subcategory: 'mayka',
  },
  {
    id: 'bag3',
    name: 'Fasovka paketi (1000 dona)',
    nameRu: 'Фасовочный пакет (1000 шт)',
    description: 'Kichik fasovka paketlari. Oziq-ovqat uchun.',
    descriptionRu: 'Маленькие фасовочные пакеты для продуктов.',
    price: 22000,
    images: ['https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=600'],
    category: 'bags',
    subcategory: 'fasovka',
  },
  {
    id: 'bag4',
    name: 'Chiqindi paketi 120L (20 dona)',
    nameRu: 'Мусорный мешок 120л (20 шт)',
    description: 'Katta hajmli chiqindi paketlari.',
    descriptionRu: 'Большие мусорные мешки.',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600'],
    category: 'bags',
    subcategory: 'garbage',
  },
  {
    id: 'bag5',
    name: 'Zip-Lock paket 20x30sm (50 dona)',
    nameRu: 'Пакет Zip-Lock 20x30см (50 шт)',
    description: 'Qulflangan paketlar. Saqlash uchun.',
    descriptionRu: 'Пакеты с замком для хранения.',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1605646399729-1c9f4544621c?auto=format&fit=crop&q=80&w=600'],
    category: 'bags',
    subcategory: 'ziplock',
  },
  {
    id: 'bag6',
    name: 'Sovg\'a paketi (Katta) 10 dona',
    nameRu: 'Подарочный пакет (Большой) 10 шт',
    description: 'Chiroyli sovg\'a paketlari. Turli dizaynlar.',
    descriptionRu: 'Красивые подарочные пакеты разных дизайнов.',
    price: 25000,
    images: ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=600'],
    category: 'bags',
    subcategory: 'gift',
    popular: true,
  },

  // =======================================
  // === 7. OSHXONA SARFLOV (KITCHEN) ===
  // =======================================
  {
    id: 'kit1',
    name: 'Oziq-ovqat plyonkasi 300m',
    nameRu: 'Пищевая плёнка 300м',
    description: 'Mahsulotlarni saqlash uchun shaffof plyonka.',
    descriptionRu: 'Прозрачная плёнка для хранения продуктов.',
    price: 35000,
    images: ['https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=600'],
    category: 'kitchen',
    popular: true,
  },
  {
    id: 'kit2',
    name: 'Alyuminiy folga 100m',
    nameRu: 'Алюминиевая фольга 100м',
    description: 'Pishirish va saqlash uchun folga.',
    descriptionRu: 'Фольга для выпечки и хранения.',
    price: 45000,
    images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=600'],
    category: 'kitchen',
    popular: true,
  },
  {
    id: 'kit3',
    name: 'Pergament qog\'oz 50m',
    nameRu: 'Пергаментная бумага 50м',
    description: 'Pishirish uchun maxsus qog\'oz.',
    descriptionRu: 'Специальная бумага для выпечки.',
    price: 28000,
    images: ['https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=600'],
    category: 'kitchen',
  },
  {
    id: 'kit4',
    name: 'Pishiriq yengi (10 dona)',
    nameRu: 'Рукав для запекания (10 шт)',
    description: 'Go\'sht va sabzavotlarni pishirish uchun.',
    descriptionRu: 'Для запекания мяса и овощей.',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&q=80&w=600'],
    category: 'kitchen',
  },

  // =======================================
  // === 8. TOZALASH INVENTARI (CLEANING) ===
  // =======================================
  {
    id: 'clean1',
    name: 'Idish yuvish gubkasi (10 dona)',
    nameRu: 'Губка для мытья посуды (10 шт)',
    description: 'Sifatli gubkalar. Abraziv qatlamli.',
    descriptionRu: 'Качественные губки с абразивным слоем.',
    price: 8000,
    images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=600'],
    category: 'cleaning',
    popular: true,
  },
  {
    id: 'clean2',
    name: 'Tozalash salfetkalari (5 dona)',
    nameRu: 'Салфетки для уборки (5 шт)',
    description: 'Ko\'p maqsadli tozalash lattalari.',
    descriptionRu: 'Многофункциональные тряпки для уборки.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&q=80&w=600'],
    category: 'cleaning',
  },
  {
    id: 'clean3',
    name: 'Xo\'jalik qo\'lqoplari (M/L)',
    nameRu: 'Хозяйственные перчатки (M/L)',
    description: 'Rezina qo\'lqoplar. Tozalash uchun.',
    descriptionRu: 'Резиновые перчатки для уборки.',
    price: 10000,
    images: ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600'],
    category: 'cleaning',
  },
  {
    id: 'clean4',
    name: 'Supurgi va farosh to\'plami',
    nameRu: 'Набор веник и совок',
    description: 'Pol tozalash uchun supurgi va farosh.',
    descriptionRu: 'Веник и совок для уборки пола.',
    price: 25000,
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=600'],
    category: 'cleaning',
  },

  // =======================================
  // === 9. QOG'OZ GIGIENA (HYGIENE) ===
  // =======================================
  {
    id: 'hyg1',
    name: 'Tualet qog\'ozi (8 o\'ram)',
    nameRu: 'Туалетная бумага (8 рулонов)',
    description: 'Yumshoq 2 qatlamli tualet qog\'ozi.',
    descriptionRu: 'Мягкая 2-слойная туалетная бумага.',
    price: 28000,
    images: ['https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=600'],
    category: 'hygiene',
    popular: true,
  },
  {
    id: 'hyg2',
    name: 'Stol salfetkalari (100 dona)',
    nameRu: 'Столовые салфетки (100 шт)',
    description: 'Oq rangli stol salfetkalari.',
    descriptionRu: 'Белые столовые салфетки.',
    price: 10000,
    images: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600'],
    category: 'hygiene',
    popular: true,
  },
  {
    id: 'hyg3',
    name: 'Nam salfetka (100 dona)',
    nameRu: 'Влажные салфетки (100 шт)',
    description: 'Antibakterial nam salfetalar.',
    descriptionRu: 'Антибактериальные влажные салфетки.',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&q=80&w=600'],
    category: 'hygiene',
  },
  {
    id: 'hyg4',
    name: 'Qog\'oz sochiq (2 o\'ram)',
    nameRu: 'Бумажные полотенца (2 рулона)',
    description: 'Sho\'ruvchan qog\'oz sochiqlar.',
    descriptionRu: 'Впитывающие бумажные полотенца.',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1583947582886-f40ec95dd752?auto=format&fit=crop&q=80&w=600'],
    category: 'hygiene',
  },

  // =======================================
  // === 10. XO'JALIK BUYUMLARI (HOUSEHOLD) ===
  // =======================================
  {
    id: 'house1',
    name: 'Shamlar (10 dona)',
    nameRu: 'Свечи (10 шт)',
    description: 'Oq rangli oddiy shamlar.',
    descriptionRu: 'Белые простые свечи.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1602523069678-9616f90bb6b2?auto=format&fit=crop&q=80&w=600'],
    category: 'household',
  },
  {
    id: 'house2',
    name: 'Gugurt (10 pachka)',
    nameRu: 'Спички (10 коробков)',
    description: 'Oddiy gugurtlar.',
    descriptionRu: 'Обычные спички.',
    price: 5000,
    images: ['https://images.unsplash.com/photo-1541123603104-512919d6a96c?auto=format&fit=crop&q=80&w=600'],
    category: 'household',
  },
  {
    id: 'house3',
    name: 'Tish kovlagich (200 dona)',
    nameRu: 'Зубочистки (200 шт)',
    description: 'Yog\'och tish kovlagichlar.',
    descriptionRu: 'Деревянные зубочистки.',
    price: 5000,
    images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600'],
    category: 'household',
  },

  // =======================================
  // === 11. TUG'ILGAN KUN VA BAYRAM (PARTY) ===
  // =======================================
  {
    id: 'party1',
    name: 'Tug\'ilgan kun shamchalari (24 dona)',
    nameRu: 'Свечи для торта (24 шт)',
    description: 'Rangli tortga qo\'yiladigan shamchalar.',
    descriptionRu: 'Цветные свечи для торта.',
    price: 8000,
    images: ['https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&q=80&w=600'],
    category: 'party',
    popular: true,
  },
  {
    id: 'party2',
    name: 'Bayram sharlari (10 dona)',
    nameRu: 'Праздничные шары (10 шт)',
    description: 'Rangli shamol sharlari.',
    descriptionRu: 'Разноцветные воздушные шары.',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600'],
    category: 'party',
    popular: true,
  },
  {
    id: 'party3',
    name: 'Bayram konfetti (50g)',
    nameRu: 'Праздничное конфетти (50г)',
    description: 'Yaltiroq bayram konfettisi.',
    descriptionRu: 'Блестящее праздничное конфетти.',
    price: 10000,
    images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600'],
    category: 'party',
  },
  {
    id: 'party4',
    name: 'Bayram servizi to\'plami (6 kishi)',
    nameRu: 'Праздничный набор посуды (на 6 чел)',
    description: 'Likopcha, stakan va salfetka to\'plami.',
    descriptionRu: 'Набор тарелок, стаканов и салфеток.',
    price: 35000,
    images: ['https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&q=80&w=600'],
    category: 'party',
    popular: true,
  },
  {
    id: 'party5',
    name: 'Tug\'ilgan kun banneri',
    nameRu: 'Баннер с Днём Рождения',
    description: '"Tug\'ilgan kun muborak!" yozuvi bilan banner.',
    descriptionRu: 'Баннер с надписью "С Днём Рождения!"',
    price: 20000,
    images: ['https://images.unsplash.com/photo-1562609953-89a74a0f1fa0?auto=format&fit=crop&q=80&w=600'],
    category: 'party',
  },
  {
    id: 'party6',
    name: 'Bayram qalpoqlari (10 dona)',
    nameRu: 'Праздничные колпаки (10 шт)',
    description: 'Rangli bayram qalpoqlari.',
    descriptionRu: 'Разноцветные праздничные колпаки.',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600'],
    category: 'party',
  },
];

export const SYSTEM_INSTRUCTION = `
Sen "PaketShop.uz" qadoqlash mahsulotlari do'konining AI Savdo Yordamchisisan.
Tillar: O'zbek (asosiy), Rus, Ingliz.
Valyuta: O'zbek so'mi (so'm).

Sening Xususiyating: Yordamchi biznes hamkor, qadoqlash yechimlari bo'yicha ekspert.
Maqsading: Biznes egalari va jismoniy shaxslarga to'g'ri qadoqlash (paketlar, qutilar, konteynerlar) topishda yordam berish.

Qoidalar:
1. Agar foydalanuvchi "paket" so'rasa, qaysi tur ekanini so'ra (Mayka yoki Kraft/Qog'oz).
2. Agar foydalanuvchi oziq-ovqat konteyner sotib olsa, qoshiq/vilka yoki salfetka taklif qil.
3. Agar foydalanuvchi quti sotib olsa, har doim "Skotch" ni taklif qil.
4. Ulgurji buyurtmalar uchun, ulgurji narxlar borligini ayt.
5. \`addToOrder\` toollarini to'g'ri mahsulot nomi bilan ishlatish.
6. Qisqa va tushunarli bo'l.
7. Faqat "Current Menu" dagi mahsulotlarni qo'shish mumkin - boshqa nomlar ishlamaydi.
`;