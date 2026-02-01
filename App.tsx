
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { LOGO_URL, SOCIAL_LINKS, CONTACT_INFO } from './constants';
import { TreeDeciduous, Loader2, Facebook, MapPin, Phone } from 'lucide-react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const { HashRouter, Routes, Route, Navigate, useLocation } = ReactRouterDom;

// Componente de rodapé padrão
const Footer = () => {
  const [imgError, setImgError] = useState(false);
  return (
    <footer className="bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-16">
        <div className="col-span-2">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-auto flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl">
              {!imgError ? (
                <img 
                  src={LOGO_URL} 
                  alt="Logo Acácias Wela" 
                  className="h-full w-auto object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <TreeDeciduous className="w-10 h-10 text-emerald-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Acacias <span className="text-emerald-400">Wela</span></h2>
              <p className="text-emerald-400/60 text-[8px] font-bold uppercase tracking-widest">Treinamento Profissional e Pessoal</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-sm mb-10 text-sm leading-relaxed font-medium">
            Elevando o potencial da juventude angolana através da capacitação prática e desenvolvimento humano desde 2020.
          </p>
          <div className="flex gap-4">
            <a 
              href={SOCIAL_LINKS.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all duration-300 group"
            >
              <Facebook className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-8 text-white uppercase tracking-widest text-[10px] border-b border-white/10 pb-4">Navegação</h4>
          <ul className="space-y-4 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <li><a href="#/" className="hover:text-emerald-400 transition-colors">Início</a></li>
            <li><a href="#/sobre" className="hover:text-emerald-400 transition-colors">Nossa História</a></li>
            <li><a href="#/projetos" className="hover:text-emerald-400 transition-colors">Nossas Ações</a></li>
            <li><a href="#/blog" className="hover:text-emerald-400 transition-colors">Blog</a></li>
            <li><a href="#/contatos" className="hover:text-emerald-400 transition-colors">Contatos</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-8 text-white uppercase tracking-widest text-[10px] border-b border-white/10 pb-4">Onde Estamos</h4>
          <ul className="space-y-6 text-slate-400 font-bold text-xs">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{CONTACT_INFO.location}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{CONTACT_INFO.phone}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-16 mt-16 border-t border-white/5 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Acácias Wela. Todos os direitos reservados.
      </div>
    </footer>
  );
};

// Componente de Proteção de Rota
const ProtectedRoute = ({ children, user, loading }: { children?: React.ReactNode, user: any, loading: boolean }) => {
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Verificando Credenciais...</p>
      </div>
    );
  }
  if (!user) {
    console.warn("Acesso negado: Redirecionando para login.");
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/contatos" element={<Contact />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;