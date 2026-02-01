
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { siteService } from './services/siteService';
import { LOGO_URL, SOCIAL_LINKS, CONTACT_INFO } from './constants';
import { TreeDeciduous, Loader2, Facebook, MapPin, Phone, X, Bell, ExternalLink, Heart } from 'lucide-react';
import { SiteConfig, SiteNotification } from './types';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const { HashRouter, Routes, Route, Navigate, useLocation } = ReactRouterDom;

// Componente de Notificação Global
const NotificationBanner = ({ notification }: { notification?: SiteNotification }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!notification?.active || !isVisible) return null;

  const styles = {
    success: 'bg-emerald-600 text-white',
    info: 'bg-sky-600 text-white',
    warning: 'bg-amber-500 text-white'
  };

  return (
    <div className={`${styles[notification.type || 'info']} py-3 px-4 relative z-[60] flex items-center justify-center gap-4 transition-all animate-in slide-in-from-top duration-500`}>
      <div className="flex items-center gap-3 max-w-7xl mx-auto px-4 w-full">
        <Bell className="w-4 h-4 shrink-0 animate-bounce" />
        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest flex-grow text-center md:text-left">
          {notification.message}
        </p>
        {notification.link && (
          <a 
            href={notification.link.startsWith('http') ? notification.link : `#${notification.link}`} 
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-[9px] font-black uppercase transition whitespace-nowrap"
          >
            Ver Mais <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// BOTÃO FLUTUANTE PARA SEGUIR (PUSH)
const FollowProjectButton = () => {
  const [status, setStatus] = useState<NotificationPermission | 'unsupported'>(
    'default'
  );

  useEffect(() => {
    if (!('Notification' in window)) {
      setStatus('unsupported');
    } else {
      setStatus(Notification.permission);
    }
  }, []);

  const handleFollow = async () => {
    if (status === 'unsupported') {
      alert('O seu navegador não suporta notificações diretas. Tente no Chrome ou Safari do telemóvel.');
      return;
    }

    const permission = await Notification.requestPermission();
    setStatus(permission);

    if (permission === 'granted') {
      new Notification("Acácias Wela", {
        body: "Obrigado por seguir o projeto! Receberá novidades diretamente aqui.",
        icon: LOGO_URL
      });
    }
  };

  if (status === 'granted' || status === 'unsupported') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <button 
        onClick={handleFollow}
        className="bg-slate-900 text-white px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:bg-emerald-600 transition-all border-2 border-white/20 hover:scale-105 active:scale-95"
      >
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        Seguir Projeto
      </button>
    </div>
  );
};

const Footer = ({ config }: { config: SiteConfig | null }) => {
  const [imgError, setImgError] = useState(false);
  const info = config?.contact || CONTACT_INFO;
  const fbLink = config?.contact?.facebook || SOCIAL_LINKS.facebook;

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
            Elevando o potencial da juventude angolana através da capacitação prática e desenvolvimento humano em Benguela desde 2020.
          </p>
          <div className="flex gap-4">
            <a 
              href={fbLink} 
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
          <h4 className="font-bold mb-8 text-white uppercase tracking-widest text-[10px] border-b border-white/10 pb-4">Sede Benguela</h4>
          <ul className="space-y-6 text-slate-400 font-bold text-xs">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{info.location}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{info.phone}</span>
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

const ProtectedRoute = ({ children, user, loading }: { children?: React.ReactNode, user: any, loading: boolean }) => {
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    
    siteService.getConfig().then(setSiteConfig);

    return () => unsubscribe();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && siteConfig?.notification?.active && (
        <NotificationBanner notification={siteConfig.notification} />
      )}
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
      {!isAdminPath && <FollowProjectButton />}
      {!isAdminPath && <Footer config={siteConfig} />}
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
