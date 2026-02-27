import { useState, useEffect } from 'react';
import { ArrowLeft, Store, ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold">购物车 ({cartItems.length})</h2>
        <div className="w-6 h-6"></div>
      </header>

      <main className="flex-1 p-4 pb-32">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p className="mb-6">你的购物车还是空的</p>
            <button
              onClick={() => navigate('/')}
              className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold"
            >
              去逛逛
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
              <input type="checkbox" defaultChecked className="rounded text-pink-600" />
              <Store className="w-5 h-5 text-slate-600" />
              <span className="font-bold text-sm">官方商城</span>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-white rounded-xl shadow-sm border border-slate-100"
              >
                <div className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded text-pink-600" />
                </div>
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-100">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-pink-600 font-bold">¥{item.price}</span>
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 px-2 text-slate-400"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 px-2 text-slate-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {cartItems.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded text-pink-600" />
            <span className="text-sm text-slate-500">全选</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400">不含运费</p>
              <p className="text-pink-600 font-bold">合计: ¥{subtotal.toFixed(0)}</p>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-pink-100"
            >
              结算
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


