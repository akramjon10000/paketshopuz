import React, { useState } from 'react';
import { useMenu } from '../../context/MenuContext';
import { Product } from '../../types';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Info, Save, Sparkles, Loader2, Tag } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../components/Toast';

const AdminMenu = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useMenu();
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  
  // Image management state
  const [imageInputs, setImageInputs] = useState<string[]>(['', '', '', '']);
  const [activeTab, setActiveTab] = useState<'info' | 'images'>('info');

  // AI State
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process images
    const processedImages = imageInputs.map(url => url.trim()).filter(url => url.length > 0);
    
    const productData = {
      ...editingProduct,
      price: Number(editingProduct.price),
      id: editingProduct.id || Math.random().toString(36).substr(2, 9),
      popular: editingProduct.popular || false,
      images: processedImages.length > 0 ? processedImages : ['https://via.placeholder.com/400'],
      // Ensure other required fields are present with defaults if missing
      name: editingProduct.name || 'New Product',
      description: editingProduct.description || '',
      category: editingProduct.category || 'bags',
      seoKeywords: editingProduct.seoKeywords || ''
    } as Product;

    try {
      if (editingProduct.id) {
        await updateProduct(productData);
        showToast('Mahsulot yangilandi');
      } else {
        await addProduct(productData);
        showToast('Mahsulot qo\'shildi');
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Product save failed:', error);
      showToast('Mahsulotni saqlashda xatolik yuz berdi', 'error');
    }
  };

  const resetForm = () => {
    setEditingProduct({});
    setImageInputs(['', '', '', '']);
    setActiveTab('info');
    setIsGenerating(false);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    
    // Handle migration & initialization
    let imgs = product.images || [];
    if (imgs.length === 0 && (product as any).image) {
        imgs = [(product as any).image];
    }
    
    // Pad with empty strings up to 4
    const inputs = [...imgs];
    while (inputs.length < 4) inputs.push('');
    setImageInputs(inputs.slice(0, 4));
    
    setActiveTab('info');
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingProduct({ category: 'bags' });
    setImageInputs(['', '', '', '']);
    setActiveTab('info');
    setIsModalOpen(true);
  };

  const handleImageChange = (index: number, value: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = value;
    setImageInputs(newInputs);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatan ham o\'chirmoqchimisiz?')) {
        return;
    }

    try {
        await deleteProduct(id);
        showToast('Mahsulot o\'chirildi');
    } catch (error) {
        console.error('Product delete failed:', error);
        showToast('Mahsulotni o\'chirishda xatolik yuz berdi', 'error');
    }
  };

  const generateAIContent = async () => {
    if (!editingProduct.name) {
        alert("Iltimos, avval mahsulot nomini kiriting.");
        return;
    }

    if (!process.env.API_KEY) {
        alert("API kaliti topilmadi.");
        return;
    }

    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Define language name for prompt
        const targetLang = lang === 'ru' ? 'Rus' : lang === 'en' ? 'Ingliz' : 'O\'zbek';
        
        const prompt = `
            Mahsulot: "${editingProduct.name}"
            Kategoriya: "${editingProduct.category || 'qadoqlash'}"
            
            Vazifa: 
            1. Ushbu qadoqlash mahsuloti uchun ${targetLang} tilida qisqa, jozibali va sotuvbop tavsif yozing (maksimum 2 gap).
            2. Ushbu mahsulot uchun qidiruv tizimlari (SEO) uchun 5-8 ta vergul bilan ajratilgan kalit so'zlarni (${targetLang} tilida) yozing.
            
            Javobni faqat JSON formatida qaytaring:
            {
                "description": "...",
                "keywords": "..."
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (text) {
            const result = JSON.parse(text);
            setEditingProduct(prev => ({
                ...prev,
                description: result.description,
                seoKeywords: result.keywords
            }));
        }
    } catch (error) {
        console.error("AI Error:", error);
        alert("AI tavsif yaratishda xatolik yuz berdi.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-slide-up">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
            <h2 className="text-2xl font-black text-slate-900">Katalog Boshqaruv</h2>
            <p className="text-slate-500 text-sm">Mahsulotlarni qo'shish va tahrirlash</p>
        </div>
        <button 
          onClick={openNew}
          className="bg-orange-600 text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all"
        >
          <Plus size={18} /> <span className="hidden md:inline">Yangi Mahsulot</span>
        </button>
      </div>

      <div className="grid gap-3">
        {products.map(product => {
          const displayImg = product.images?.[0] || (product as any).image || 'https://via.placeholder.com/150';
          
          return (
            <div key={product.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-all hover:shadow-md">
                <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 relative group">
                    <img 
                        src={displayImg} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Img'; }}
                    />
                    {product.popular && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                </div>
                
                <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded mb-1">
                                {product.category}
                            </span>
                            <h3 className="font-bold text-slate-900 leading-tight">{product.name}</h3>
                        </div>
                        <div className="flex space-x-1">
                            <button onClick={() => openEdit(product)} className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 line-clamp-1 my-1">{product.description}</p>
                    {product.seoKeywords && (
                         <div className="flex flex-wrap gap-1 mt-1">
                            {product.seoKeywords.split(',').slice(0, 3).map((k, i) => (
                                <span key={i} className="text-[9px] bg-slate-50 text-slate-400 px-1 rounded border border-slate-100">{k.trim()}</span>
                            ))}
                         </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-auto">
                        <span className="font-black text-slate-900">{formatCurrency(product.price)}</span>
                        {product.images && product.images.length > 1 && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                <ImageIcon size={10} /> {product.images.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h3 className="text-xl font-black text-slate-900">{editingProduct.id ? 'Tahrirlash' : 'Yangi Mahsulot'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-slate-50 border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'info' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Info size={16} /> Asosiy
                </button>
                <button 
                    onClick={() => setActiveTab('images')}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'images' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ImageIcon size={16} /> Rasmlar ({imageInputs.filter(i => i).length}/4)
                </button>
            </div>

            <div className="overflow-y-auto p-5">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
                
                {activeTab === 'info' && (
                    <div className="space-y-4 animate-slide-up">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nomi</label>
                            <input 
                            required
                            value={editingProduct.name || ''} 
                            onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-orange-500 focus:bg-white outline-none transition-all"
                            placeholder="Masalan: Kraft paket 25x35"
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Narxi (so'm)</label>
                                <input 
                                    required
                                    type="number"
                                    value={editingProduct.price || ''} 
                                    onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-orange-500 focus:bg-white outline-none transition-all"
                                    placeholder="1500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kategoriya</label>
                                <select 
                                    value={editingProduct.category || 'bags'}
                                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})}
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-orange-500 focus:bg-white outline-none transition-all appearance-none"
                                >
                                    <option value="bags">Paketlar</option>
                                    <option value="boxes">Qutilar</option>
                                    <option value="disposable">Bir martalik idishlar</option>
                                    <option value="tape">Skotch</option>
                                    <option value="hygiene">Gigiena</option>
                                </select>
                            </div>
                        </div>

                        {/* AI Generator Button */}
                        <div className="flex justify-end">
                            <button 
                                type="button"
                                onClick={generateAIContent}
                                disabled={isGenerating || !editingProduct.name}
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                                    isGenerating || !editingProduct.name
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                                }`}
                            >
                                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                AI Yordamchi (SEO) [{lang.toUpperCase()}]
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tavsif (Description)</label>
                            <textarea 
                                required
                                value={editingProduct.description || ''} 
                                onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-orange-500 focus:bg-white outline-none transition-all resize-none h-24"
                                placeholder="Mahsulot haqida qisqacha..."
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1.5">
                                <Tag size={12} /> SEO Kalit so'zlar
                            </label>
                            <textarea 
                                value={editingProduct.seoKeywords || ''} 
                                onChange={e => setEditingProduct({...editingProduct, seoKeywords: e.target.value})}
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-orange-500 focus:bg-white outline-none transition-all resize-none h-16"
                                placeholder="paket, ulgurji, quti, arzon..."
                            />
                            <p className="text-[10px] text-slate-400 mt-1">AI orqali avtomatik to'ldirish mumkin.</p>
                        </div>

                        <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <input 
                            type="checkbox"
                            id="popular"
                            checked={editingProduct.popular || false}
                            onChange={e => setEditingProduct({...editingProduct, popular: e.target.checked})}
                            className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                            />
                            <label htmlFor="popular" className="font-bold text-sm text-slate-700 cursor-pointer select-none">
                                "Xit tovarlar" ga qo'shish
                            </label>
                        </div>
                    </div>
                )}

                {activeTab === 'images' && (
                    <div className="space-y-4 animate-slide-up">
                        <p className="text-xs text-slate-400 bg-blue-50 text-blue-600 p-3 rounded-xl">
                            Mahsulotga 4 tagacha rasm qo'shishingiz mumkin. URL manzilini kiriting.
                        </p>
                        
                        {imageInputs.map((url, idx) => (
                            <div key={idx} className="flex gap-3 items-center group">
                                <div className="w-14 h-14 bg-slate-100 rounded-xl border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                                    {url ? (
                                        <img 
                                            src={url} 
                                            alt={`Preview ${idx}`} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'; }}
                                        />
                                    ) : (
                                        <span className="text-xs font-bold text-slate-300">#{idx + 1}</span>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <input 
                                        type="text"
                                        value={url}
                                        onChange={e => handleImageChange(idx, e.target.value)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-orange-500 focus:bg-white outline-none transition-all"
                                        placeholder={`Rasm havolasi (URL) #${idx + 1}`}
                                    />
                                </div>
                                {url && (
                                    <button 
                                        type="button"
                                        onClick={() => handleImageChange(idx, '')}
                                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-white">
                <button 
                    type="submit" 
                    form="product-form"
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Save size={20} /> Saqlash
                </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
