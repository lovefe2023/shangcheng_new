import { useState, useEffect } from 'react';
import { ArrowLeft, Store, ChevronRight, PackageSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        // Dummy user ID for this demo
        const userId = '00000000-0000-0000-0000-000000000000';
        const data = await api.getOrders(userId);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 font-sans h-full flex flex-col antialiased overflow-y-auto">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="flex items-center justify-center text-slate-900 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">我的订单</h1>
          <div className="w-8"></div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex min-w-full px-4 border-b border-slate-200">
            <button className="flex-none px-4 py-3 text-sm font-bold text-pink-600 border-b-[3px] border-pink-600 whitespace-nowrap"> 全部 </button>
            <button className="flex-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent whitespace-nowrap"> 待付款 </button>
            <button className="flex-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent whitespace-nowrap"> 待发货 </button>
            <button className="flex-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent whitespace-nowrap"> 待收货 </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <PackageSearch className="w-16 h-16 mb-4 opacity-20" />
            <p>还没有订单记录</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4 cursor-pointer" onClick={() => navigate(`/order/${order.id}`)}>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-900">平台自营</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-pink-600">{order.status === 'unpaid' ? '待付款' : '已完成'}</span>
              </div>

              {order.order_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 mb-4">
                  <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url('${item.products?.image_url}')` }}></div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight truncate mb-1">{item.products?.title}</h3>
                      <p className="text-xs text-slate-500">数量: {item.quantity}</p>
                    </div>
                    <div className="text-base font-bold text-slate-900 text-right">¥{item.price}</div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
                <div className="flex justify-end items-center gap-1 text-sm text-slate-900">
                  <span className="text-slate-500">合计:</span>
                  <span className="font-bold">¥{order.total_amount}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-600">
                    查看详情
                  </button>
                  {order.status === 'unpaid' && (
                    <button className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-medium shadow-sm shadow-pink-600/30">
                      去支付
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        <div className="h-8 flex items-center justify-center">
          <p className="text-xs text-slate-400">没有更多订单了</p>
        </div>
      </main>
    </div>
  );
}
