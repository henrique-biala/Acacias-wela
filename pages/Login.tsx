
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { LOGO_URL } from '../constants';

interface LoginProps {
  user: any; // Aceita User do Firebase ou MockUser
}

const Login: React.FC<LoginProps> = ({ user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // BYPASS PARA TESTE: admin@acaciaswela.org / admin123
    if (email === 'admin@acaciaswela.org' && password === 'admin123') {
      // Simula um delay de rede
      setTimeout(() => {
        localStorage.setItem('acacias_mock_user', JSON.stringify({
          email: 'admin@acaciaswela.org',
          displayName: 'Administrador de Teste',
          uid: 'mock-123'
        }));
        window.location.reload(); // Recarrega para o App.tsx capturar o novo estado
      }, 800);
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError('Credenciais inválidas ou erro de conexão com Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="h-24 w-auto mb-6">
              <img 
                src={LOGO_URL} 
                alt="Acacias Wela Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Painel de Gestão</h1>
            <p className="text-slate-400 text-sm font-medium">Exclusivo para administradores</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100 animate-in shake duration-300">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="admin@acaciaswela.org"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 ring-emerald-500 outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : <><ArrowRight className="w-5 h-5" /> Entrar Agora</>}
            </button>
            
            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-[10px] text-amber-700 font-bold uppercase text-center">Modo de Teste Disponível</p>
              <p className="text-[9px] text-amber-600 text-center mt-1">Use admin@acaciaswela.org / admin123</p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium italic">
              "Treinando jovens para o sucesso pessoal e profissional."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
