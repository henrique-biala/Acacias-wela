import React, { useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { LOGO_URL } from '../constants';

const { Navigate, useNavigate } = ReactRouterDom;

interface LoginProps {
  user: any;
}

const Login: React.FC<LoginProps> = ({ user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Se já estiver logado, manda pro Admin
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login bem-sucedido via Firebase:", userCredential.user.email);
      // Aguardamos um breve momento para o onAuthStateChanged no App.tsx atualizar o estado
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } catch (err: any) {
      console.error("Erro Firebase Auth:", err.code);
      
      switch (err.code) {
        case 'auth/user-not-found':
          setError('O e-mail indicado não está registado no sistema.');
          break;
        case 'auth/wrong-password':
          setError('A palavra-passe inserida está incorreta.');
          break;
        case 'auth/invalid-email':
          setError('O formato do e-mail não é válido.');
          break;
        case 'auth/operation-not-allowed':
          setError('O login por E-mail/Senha não está ativo no Console do Firebase.');
          break;
        default:
          setError('Não foi possível entrar: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 transition-all">
        <div className="p-10 md:p-14">
          <div className="flex flex-col items-center mb-12">
            <div className="h-24 w-auto mb-8 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm">
              <img 
                src={LOGO_URL} 
                alt="Acacias Wela Logo" 
                className="h-full w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">Acesso Restrito</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Portal Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                  placeholder="admin@acaciaswela.org"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-6 h-6" /> 
                  Entrar no Painel
                </>
              )}
            </button>
            
            <div className="mt-8 p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100">
              <p className="text-[9px] text-amber-700 font-black uppercase text-center tracking-[0.2em] mb-3">Segurança do Portal</p>
              <p className="text-[11px] text-amber-600 text-center leading-relaxed">
                Apenas administradores autorizados com contas configuradas no Firebase podem aceder a esta área.
              </p>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em] italic">
              Angola &bull; Futuro &bull; Capacitação
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;