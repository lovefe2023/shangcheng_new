import { useState, useEffect } from 'react';
import { Settings, Edit2, ChevronRight, Wallet, Package, Truck, CheckCircle, RotateCcw, MapPin, Ticket, Heart, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ orders: 0, points: 0, coupons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const userId = '00000000-0000-0000-0000-000000000000';

        const { data: pData } = await supabase.from('profiles').select('*').eq('id', userId).single();
        const { count: oCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', userId);

        setProfile(pData);
        setStats({
          orders: oCount || 0,
          points: pData?.points || 0,
          coupons: 3 // Hardcoded for demo
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
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
      <header className="bg-white px-4 py-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">个人中心</h1>
          <button className="text-slate-600">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="h-20 w-20 rounded-full bg-slate-100 bg-cover bg-center border-2 border-slate-100"
            style={{ backgroundImage: `url('${profile?.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'}')` }}
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{profile?.full_name || '探索者'}</h2>
            <p className="text-slate-500 text-sm mt-1">{profile?.phone || '手机号未绑定'}</p>
            <div className="mt-2 text-[10px] font-bold bg-pink-50 text-pink-600 px-2 py-1 rounded-full w-fit">
              {profile?.membership_tier || '普通会员'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-50">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{stats.coupons}</span>
            <span className="text-[10px] text-slate-500">优惠券</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{stats.points}</span>
            <span className="text-[10px] text-slate-500">积分</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">0</span>
            <span className="text-[10px] text-slate-500">收藏</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-20">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-4 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-50">
            <h3 className="font-bold text-sm">我的订单</h3>
            <button onClick={() => navigate('/orders')} className="text-pink-600 text-xs flex items-center">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 py-4">
            {[
              { icon: Wallet, label: '待付款', count: stats.orders },
              { icon: Package, label: '待发货', count: 0 },
              { icon: Truck, label: '待收货', count: 0 },
              { icon: CheckCircle, label: '已完成', count: 0 }
            ].map((item, idx) => (
              <button key={idx} className="flex flex-col items-center gap-1 relative">
                <item.icon className="w-6 h-6 text-slate-400" />
                <span className="text-[10px] text-slate-600">{item.label}</span>
                {item.count > 0 && (
                  <span className="absolute -top-1 right-4 bg-pink-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {[
            { icon: MapPin, label: '收货地址' },
            { icon: Ticket, label: '领券中心' },
            { icon: Heart, label: '商品收藏' },
            { icon: HelpCircle, label: '帮助中心' }
          ].map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-4 border-b last:border-0 border-slate-50">
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          ))}
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}
          className="w-full mt-6 py-4 bg-white text-slate-400 font-medium text-sm rounded-xl border border-slate-200"
        >
          退出登录
        </button>
      </main>
    </div>
  );
}



