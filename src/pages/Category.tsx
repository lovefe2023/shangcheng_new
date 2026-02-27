import { Search, Grid, Sparkles, Flame, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
    { id: '1', name: '美妆', icon: Sparkles, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: '2', name: '数码', icon: Grid, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: '3', name: '时尚', icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
    { id: '4', name: '家居', icon: Ticket, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function Category() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <header className="sticky top-0 z-20 bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900">全部分类</h1>
                <button className="p-2 text-slate-600">
                    <Search className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 p-4">
                <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => navigate(`/products?category=${cat.name}`)}
                            className="flex flex-col items-center justify-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <div className={`w-16 h-16 rounded-full ${cat.bg || 'bg-slate-50'} flex items-center justify-center ${cat.color}`}>
                                <cat.icon className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}

