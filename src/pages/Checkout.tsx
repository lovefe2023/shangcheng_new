import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ChevronRight, MessageCircle, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 35 + 17.50; // Including fees

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      // Dummy user ID for this demo
      const userId = '00000000-0000-0000-0000-000000000000';

      const orderData = {
        userId,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        shippingAddress: '上海市浦东新区陆家嘴环路1000号, 4B室',
        paymentMethod: '微信支付'
      };

      const result = await api.createOrder(orderData);

      if (result.success) {
        localStorage.removeItem('cart');
        alert('订单提交成功！');
        navigate('/orders');
      } else {
        alert('订单提交失败: ' + result.error);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('结算失败，请检查后端服务。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden pb-24 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4 h-16 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 text-slate-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-center flex-1 pr-10">确认订单</h1>
        </div>
      </header>

      <main className="flex flex-col gap-6 p-4 max-w-md mx-auto">
        {/* Address */}
        <section className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer border border-pink-600/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-full bg-pink-600/10 shrink-0 h-12 w-12 text-pink-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-slate-900">张三</span>
                <span className="text-sm font-medium text-slate-500">138 0013 8000</span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                上海市浦东新区陆家嘴环路1000号, 4B室
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-400" />
          </div>
        </section>

        {/* Product List */}
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900">商品清单</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-600/5">
            {cartItems.map((item, idx) => (
              <div key={item.id}>
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 rounded-lg h-20 w-20 shrink-0 bg-cover bg-center border border-slate-200" style={{ backgroundImage: `url('${item.image_url}')` }}></div>
                  <div className="flex flex-col flex-1 h-20 justify-between">
                    <div>
                      <p className="text-base font-medium text-slate-900 line-clamp-1">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.category}</p>
                    </div>
                    <div className="flex justify-between items-end w-full">
                      <p className="text-sm font-medium text-slate-500">数量: {item.quantity}</p>
                      <p className="text-base font-bold text-pink-600">¥{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                {idx < cartItems.length - 1 && <div className="h-px bg-slate-100 my-4"></div>}
              </div>
            ))}
          </div>
        </section>

        {/* Payment Method */}
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900">支付方式</h3>
          <div className="bg-white rounded-xl shadow-sm border border-pink-600/5 overflow-hidden">
            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#09BB07]/10 text-[#09BB07]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-base font-medium text-slate-900">微信支付</span>
              </div>
              <input type="radio" name="payment" defaultChecked className="h-5 w-5 text-pink-600 border-slate-300 focus:ring-pink-600" />
            </label>
          </div>
        </section>

        {/* Summary */}
        <section className="flex flex-col gap-3 pt-2">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-pink-600/5">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">商品小计</span>
              <span className="text-slate-900 font-medium">¥{(totalAmount - 35 - 17.5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">运费</span>
              <span className="text-slate-900 font-medium">¥35.00</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">税费</span>
              <span className="text-slate-900 font-medium">¥17.50</span>
            </div>
            <div className="h-px bg-slate-100 my-2"></div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-bold text-slate-900">合计</span>
              <span className="text-xl font-bold text-pink-600">¥{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] px-4 py-3 pb-safe z-50 max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">总计金额</span>
            <span className="text-xl font-bold text-pink-600">¥{totalAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || cartItems.length === 0}
            className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-pink-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>{submitting ? '处理中...' : '立即支付'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

