import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Star, ShoppingCart, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProduct() {
            try {
                if (id) {
                    const data = await api.getProduct(id);
                    setProduct(data);
                }
            } catch (err) {
                console.error('Failed to load product:', err);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <p className="text-slate-500 mb-4">商品不存在</p>
                <button onClick={() => navigate('/')} className="text-pink-600 font-bold">返回首页</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 pb-16">
            <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                    <button className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                        <Share2 className="w-6 h-6" />
                    </button>
                    <button className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                        <Heart className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="aspect-square bg-white">
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                </div>

                <div className="p-4 bg-white -mt-4 rounded-t-3xl relative z-10 shadow-sm">
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-sm font-bold text-pink-600">¥</span>
                        <span className="text-3xl font-bold text-pink-600">{product.price}</span>
                    </div>

                    <h1 className="text-xl font-bold text-slate-900 mb-2">{product.title}</h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {product.description || '暂无商品描述'}
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span>官方正品 · 质量保证</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Truck className="w-5 h-5 text-blue-500" />
                            <span>免邮直送 · 极速发货</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-4 items-center">
                <button className="relative p-2" onClick={() => navigate('/cart')}>
                    <ShoppingCart className="w-6 h-6 text-slate-600" />
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
                </button>
                <div className="flex-1 flex gap-2">
                    <button className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl">加入购物车</button>
                    <button className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-xl">立即购买</button>
                </div>
            </footer>
        </div>
    );
}


