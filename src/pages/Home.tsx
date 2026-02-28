import { useState, useEffect } from 'react';
import { Search, Bell, Grid, Sparkles, Flame, Ticket, ChevronRight, Heart, Plus, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded categories to match the design
  const staticCategories = [
    { label: '全部商品', icon: Grid, bg: 'bg-pink-100', color: 'text-pink-600', path: '/products' },
    { label: '新品上市', icon: BadgeCheck, bg: 'bg-orange-100', color: 'text-orange-500', path: '/products?tag=new' },
    { label: '热销榜单', icon: Flame, bg: 'bg-red-100', color: 'text-red-500', path: '/products?tag=hot' },
    { label: '领券中心', icon: Ticket, bg: 'bg-purple-100', color: 'text-purple-500', path: '/coupons' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const products = await api.getProducts();
        
        // Mocking some data that might be missing from API to match design
        const enhancedProducts = products.map((p: any) => ({
          ...p,
          originalPrice: p.original_price || (p.price * 1.2).toFixed(0), // Mock original price
          tag: p.categories?.name || '热卖', // Use category name as tag
          tagColor: 'text-pink-600' // Default tag color
        }));

        setRecommendations(enhancedProducts.slice(0, 6)); 
        setCategoriesList(staticCategories);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-slate-50 rounded-full px-4 py-2">
            <Search className="text-pink-500 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="搜索礼物、品牌..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-slate-400"
            />
          </div>
          <Bell className="text-slate-600 w-6 h-6" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-4">
        {/* Banner */}
        <div className="px-4 py-2">
          <div className="bg-[#3E2723] rounded-2xl overflow-hidden aspect-[2/1] relative shadow-lg">
            {/* Background Image / Texture */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#3E2723] to-[#5D4037]"></div>
             
             {/* Content */}
             <div className="absolute inset-0 p-6 flex flex-col justify-center items-start z-10">
                <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-md mb-3">节日特惠</span>
                <h2 className="text-3xl font-bold text-white mb-2">心动好礼</h2>
                <p className="text-white/80 text-sm">精选商品低至 5 折</p>
             </div>

             {/* Decorative Gift Box Image (Right side) */}
             <div className="absolute right-4 bottom-4 w-32 h-32">
                 <img 
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=300" 
                    alt="Gift" 
                    className="w-full h-full object-cover rounded-lg shadow-2xl rotate-[-10deg] border-2 border-white/20"
                 />
             </div>
             
             {/* Dots Indicator */}
             <div className="absolute bottom-3 right-4 flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
             </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-4 gap-2 px-4 py-6 bg-white">
          {categoriesList.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} shadow-sm`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <span className="text-xs font-medium text-slate-700 mt-1">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Recommendations Header */}
        <div className="px-4 mt-6 mb-3 flex justify-between items-end">
          <h3 className="font-bold text-slate-900 text-lg">为你推荐</h3>
          <button onClick={() => navigate('/products')} className="text-pink-600 text-xs flex items-center font-medium">
            查看更多 <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="px-4 grid grid-cols-2 gap-3">
          {recommendations.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="bg-white rounded-xl overflow-hidden p-3 shadow-sm border border-slate-50 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-50 mb-3">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <button className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                   <Heart className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                {/* Category Tag */}
                <div className="mb-1">
                   <span className="text-[10px] font-medium text-pink-500 bg-pink-50 px-1.5 py-0.5 rounded">
                     {item.categories?.name || '精选'}
                   </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-2">{item.title}</h4>

                {/* Price Area */}
                <div className="mt-auto flex items-end justify-between">
                  <div className="flex flex-col">
                     {item.originalPrice && (
                       <span className="text-[10px] text-slate-400 line-through decoration-slate-400">¥{item.originalPrice}</span>
                     )}
                     <div className="flex items-baseline gap-0.5">
                       <span className="text-xs font-bold text-slate-900">¥</span>
                       <span className="text-lg font-bold text-slate-900">{item.price}</span>
                     </div>
                  </div>
                  
                  {/* Add Button */}
                  <button className="w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-transform">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
