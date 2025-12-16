import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, User, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, login, logout, isAdmin } = useAuth();
    const { t, lang, setLang } = useLanguage();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        setError('');
        const success = login(username, password);
        if (!success) {
            setError('Login yoki parol noto\'g\'ri');
        }
    };

    if (!user) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-[80vh] space-y-4 max-w-md mx-auto">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-orange-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Kirish</h1>
                <p className="text-slate-500 text-center mb-4">Hisobingizga kirish uchun ma'lumotlarni kiriting</p>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <div className="w-full space-y-3">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Login"
                            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl bg-white focus:border-orange-600 outline-none transition-colors"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="password"
                            placeholder="Parol"
                            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl bg-white focus:border-orange-600 outline-none transition-colors"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-colors"
                >
                    Kirish
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-10 max-w-2xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img src="https://ui-avatars.com/api/?name=KFC+User&background=E4002B&color=fff&size=128" alt="Avatar" className="w-full h-full" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
                    <p className="text-slate-500 font-medium">{user.phone}</p>
                </div>
            </div>

            {isAdmin && (
                <button
                    onClick={() => navigate('/admin')}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 mb-6 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors"
                >
                    <LayoutDashboard size={20} />
                    <span>Open Admin Panel</span>
                </button>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                    {t.settings}
                </h2>
                <div className="space-y-6">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-slate-600 font-medium">{t.notification}</span>
                        <div className="w-12 h-6 bg-red-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="py-2">
                        <div className="flex justify-between mb-3">
                            <span className="text-slate-600 font-medium">{t.language}</span>
                        </div>
                        <div className="flex bg-slate-100 p-1.5 rounded-xl">
                            {(['uz', 'ru', 'en'] as const).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lang === l ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={logout} className="w-full py-4 text-red-600 font-bold bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                {t.logout}
            </button>
        </div>
    );
};

export default Profile;