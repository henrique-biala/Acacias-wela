
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { siteService } from './services/siteService';
// Fix: Removed non-existent LOGS_URL import
import { LOGO_URL, SOCIAL_LINKS, CONTACT_INFO } from './constants';
import { TreeDeciduous, Loader2, Facebook, MapPin, Phone, X, Bell, ExternalLink, Heart, Download, Zap } from 'lucide-react';
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

// COMPONENTE DE ALERTA FLASH (POPUP DE SISTEMA)
const FlashMessageOverlay = () => {
  const [flash, setFlash] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    // Escuta em tempo real por novas mensagens flash no Firestore
    const q = query(collection(db, 'flash_messages'), orderBy('timestamp', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          // Só mostra se for recente (últimos 30 segundos) para evitar spam ao carregar
          if (Date.now() - data.timestamp?.toMillis() < 30000) {
            setFlash({ title: data.title, body: data.body });
            
            // Tenta disparar a notificação nativa do navegador também
            if (Notification.permission === 'granted') {
              new Notification(data.title, { body: data.body, icon: LOGO_URL });
            }
          }
        }
      });
    });
    return () => unsubscribe();
  }, []);

  if (!flash) return null;

  return (
    <div className="fixed inset-x-4 top-6 z-[200] flex justify-center pointer-events-none">
      <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl border-2 border-emerald-500/50 w-full max-w-md pointer-events-auto animate-in slide-in-from-top-20 duration-500">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl shrink-0 animate-pulse">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-black text-emerald-400 uppercase text-[10px] tracking-widest">{flash.title}</h4>
              <button onClick={() => setFlash(null)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm font-bold leading-tight">{flash.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationBanner = ({ notification }: { notification?: SiteNotification }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!notification?.active || !isVisible) return null;
  const styles = { success: 'bg-emerald-600', info: 'bg-sky-600', warning: 'bg-amber-500' };

  return (
    <div className={`${styles[notification.type || 'info']} py-3 px-4 relative z-[60] flex items-center justify-center gap-4 transition-all animate-in slide-in-from-top duration-500`}>
      <div className="flex items-center gap-3 max-w-7xl mx-auto px-4 w-full text-white">
        <Bell className="w-4 h-4 shrink-0 animate-bounce" />
        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest flex-grow text-center md:text-left">
          {notification.message}
        </p>
        <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/10 rounded-lg transition"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const SmartFollowButton = () => {
  const [permission, setPermission] = useState<NotificationPermission | 'ios' | 'default'>('default');

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) setPermission('ios');
    else if ('Notification' in window) setPermission(Notification.permission);
  }, []);

  const handleFollow = async () => {
    if (permission === 'ios') {
      alert("No iPhone: Clica em 'Partilhar' e 'Adicionar ao Ecrã Principal' para receberes alertas diretos.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      await addDoc(collection(db, 'subscribers'), { timestamp: new Date(), active: true });
      alert("Inscrição confirmada! Receberás os alertas de Benguela em tempo real.");
    }
  };

  if (permission === 'granted') return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button onClick={handleFollow} className="bg-slate-900 text-white p-5 rounded-full shadow-2xl hover:bg-emerald-600 transition-all border-4 border-white active:scale-90 group relative">
        <Bell className="w-6 h-6" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Seguir Projeto</span>
      </button>
    </div>
  );
};

const Footer = ({ config }: { config: SiteConfig | null }) => {
  const info = config?.contact || CONTACT_INFO;
  return (
    <footer className="bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-16">
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <img src={LOGO_URL} className="h-16 w-auto bg-white p-2 rounded-xl" alt="Logo" />
            <div>
              <h2 className="text-xl font-black">Acacias <span className="text-emerald-400">Wela</span></h2>
              <p className="text-[8px] font-black uppercase text-emerald-400/50 tracking-[0.2em]">Impacto Social em Benguela</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">
            Capacitando a juventude angolana através de treinamento profissional e desenvolvimento humano.
          </p>
        </div>
        <div>
          <h4 className="font-black mb-6 text-[10px] uppercase tracking-widest text-slate-500">Links Rápidos</h4>
          <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <li><a href="#/" className="hover:text-emerald-400">Início</a></li>
            <li><a href="#/sobre" className="hover:text-emerald-400">Sobre</a></li>
            <li><a href="#/blog" className="hover:text-emerald-400">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-6 text-[10px] uppercase tracking-widest text-slate-500">Contacto</h4>
          <p className="text-xs font-bold text-slate-400 mb-2">{info.location}</p>
          <p className="text-xs font-bold text-slate-400">{info.phone}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-16 mt-16 border-t border-white/5 flex flex-col items-center gap-4">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] text-center">
          &copy; {new Date().getFullYear()} Acácias Wela. Todos os direitos reservados.
        </p>
        <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
          <p className="text-[10px] text-emerald-400 font-bold text-center">
            Desenvolvido por <span className="text-white">Henrique Lucas Biala</span> em colaboração com <span className="text-white">Esmael Quivunza</span>.
          </p>
        </div>
      </div>
    </footer>
  );
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
      {!isAdminPath && siteConfig?.notification?.active && <NotificationBanner notification={siteConfig.notification} />}
      {!isAdminPath && <Navbar />}
      <FlashMessageOverlay />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/contatos" element={<Contact />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPath && <SmartFollowButton />}
      {!isAdminPath && <Footer config={siteConfig} />}
    </div>
  );
};

const App = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
