import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, ArrowUpDown, Heart, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

export default function ProductList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await api.getProducts(categoryFilter || undefined);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="sticky top-0 z-20 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={() => navigate(-1)} className="text-slate-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center bg-slate-100 rounded-full px-4 py-2">
            <Search className="text-slate-400 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="搜索商品..."
              className="bg-transparent border-none outline-none w-full text-sm"
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-2">
          {['综合', '销量', '价格', '筛选'].map((tab, idx) => (
            <button
              key={tab}
              className={`text-sm py-1 px-4 ${(idx === 0 && !categoryFilter) || (tab === '筛选' && categoryFilter)
                  ? 'text-pink-600 font-bold border-b-2 border-pink-600'
                  : 'text-slate-500'
                }`}
            >
              <span className="flex items-center gap-1">
                {tab === '筛选' && categoryFilter ? categoryFilter : tab}
                {tab === '价格' && <ArrowUpDown className="w-3 h-3" />}
                {tab === '筛选' && <Filter className="w-3 h-3" />}
              </span>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p>暂无相关商品</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((item) => (
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-pink-600">¥</span>
                      <span className="text-lg font-bold text-pink-600">{item.price}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">销量 {item.sales_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


