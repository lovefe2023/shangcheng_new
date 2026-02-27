import { useState } from 'react';
import { ArrowLeft, Smartphone, ArrowRight, Check, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function QuickLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('请先阅读并同意服务条款和隐私政策');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: '新用户',
          }
        }
      });

      if (error) throw error;
      alert('注册成功！请登录。');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[480px] bg-white shadow-xl min-h-screen flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 z-10 relative">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 text-slate-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-slate-900 text-sm font-medium opacity-60">注册</div>
        </div>

        <div className="w-full px-6 py-4 flex justify-center">
          <div className="w-full aspect-[4/3] rounded-2xl bg-cover bg-center shadow-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800')" }}>
            <div className="w-full h-full bg-gradient-to-t from-white/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        <form onSubmit={handleRegister} className="flex-1 flex flex-col px-6 pt-2 pb-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              创建 <span className="text-pink-600">账户</span>
            </h1>
            <p className="text-slate-500 text-sm">
              注册发现专属奖励
            </p>
          </div>

          <div className="space-y-4 w-full">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1">
                电子邮箱
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Smartphone className="text-slate-400 group-focus-within:text-pink-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-600/20 focus:border-pink-600 transition-all text-base font-medium"
                  placeholder="请输入邮箱"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1">
                设置密码
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-400 group-focus-within:text-pink-600 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-600/20 focus:border-pink-600 transition-all text-base font-medium"
                  placeholder="请输入密码（至少6位）"
                />
              </div>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center pt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-pink-600 checked:bg-pink-600 hover:border-pink-600"
                />
                <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
              </div>
              <div className="text-sm text-slate-500 select-none">
                我已阅读并同意 <button type="button" className="text-pink-600 font-semibold hover:underline">服务条款</button> 和 <button type="button" className="text-pink-600 font-semibold hover:underline">隐私政策</button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-600/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{loading ? '注册中...' : '立即注册'}</span>
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>

          <div className="mt-8 text-center">
            <button type="button" onClick={() => navigate('/login')} className="text-pink-600 font-bold hover:underline">
              已有账号？去登录
            </button>
          </div>

          <div className="mt-auto text-center pb-2">
            <p className="text-xs text-slate-400">© 2024 Gift Mall Inc.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

