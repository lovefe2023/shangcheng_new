import { useState, useEffect } from 'react';
import { Search, Bell, Grid, Sparkles, Flame, Ticket, ChevronRight, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, products] = await Promise.all([
          api.getCategories(),
          api.getProducts()
        ]);

        // Map icons for local display if they match
        const iconMap: any = { Grid, Sparkles, Flame, Ticket };
        const mappedCats = cats.map(c => ({
          ...c,
          icon: iconMap[c.icon] || Grid,
          label: c.name,
          color: c.color,
          bg: c.bg_color,
          path: `/products?category=${c.name}`
        }));

        setCategoriesList(mappedCats);
        setRecommendations(products.slice(0, 6)); // Display first 6 as recommendations
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
      <header className="sticky top-0 z-20 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center bg-slate-100 rounded-full px-4 py-2">
          <Search className="text-slate-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="搜索商品..."
            className="bg-transparent border-none outline-none w-full text-sm"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Banner */}
        <div className="px-4 py-3">
          <div className="bg-pink-600 rounded-xl overflow-hidden aspect-[21/9] relative">
            <img
              src="https://images.unsplash.com/photo-1513519247388-19345420bd62?auto=format&fit=crop&q=80&w=800"
              alt="Banner"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
              <h2 className="text-xl font-bold">精选好礼</h2>
              <p className="text-sm">让生活充满惊喜</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-4 gap-4 px-4 py-4 bg-white">
          {categoriesList.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 rounded-full ${cat.bg || 'bg-pink-50'} flex items-center justify-center ${cat.color || 'text-pink-600'}`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-slate-600">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Recommendations */}
        <div className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-lg">为你推荐</h3>
            <button onClick={() => navigate('/products')} className="text-pink-600 text-sm font-medium">查看更多</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {recommendations.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100"
              >
                <div className="aspect-square relative">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  {item.tag && (
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium line-clamp-2 h-10 mb-2">{item.title}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-pink-600">¥</span>
                    <span className="text-lg font-bold text-pink-600">{item.price}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">{item.categories?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}



