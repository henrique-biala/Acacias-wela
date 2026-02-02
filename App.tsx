
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { siteService } from './services/siteService';
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

// MONITOR DE NOTIFICAÇÕES EM TEMPO REAL (DISPARA ALERTA DO SISTEMA)
const SystemNotificationMonitor = () => {
  useEffect(() => {
    // 1. Escuta a coleção de mensagens flash no Firestore
    const q = query(collection(db, 'flash_messages'), orderBy('timestamp', 'desc'), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const now = Date.now();
          const msgTime = data.timestamp?.toMillis() || now;

          // Só processa se a mensagem for nova (enviada nos últimos 15 segundos)
          if (now - msgTime < 15000) {
            // DISPARO DA NOTIFICAÇÃO REAL DO SISTEMA (BARRA DE NOTIFICAÇÕES)
            if ("Notification" in window && Notification.permission === "granted") {
              const notification = new Notification(data.title || "Acácias Wela", {
                body: data.body,
                icon: LOGO_URL,
                badge: LOGO_URL,
                tag: 'wela-alert', // Evita duplicados
                requireInteraction: true // Mantém na barra até o usuário interagir
              });

              notification.onclick = () => {
                window.focus();
                window.location.hash = "#/blog";
                notification.close();
              };
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
};

const SmartFollowButton = () => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'default'>('default');

  useEffect(() => {
    if (localStorage.getItem('wela_subscribed_v2')) setIsFollowed(true);
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  const handleFollow = async () => {
    try {
      // 1. Pedir permissão nativa do sistema para a barra de notificações
      if ("Notification" in window) {
        const result = await Notification.requestPermission();
        setPermission(result);
        
        if (result === 'denied') {
          alert("As notificações estão bloqueadas. Para receber avisos na barra do telemóvel, ative as notificações nas definições do seu navegador.");
          return;
        }
      }

      // 2. Registar seguidor no Firebase para o Admin ver
      const deviceId = localStorage.getItem('wela_device_id') || Math.random().toString(36).substring(7);
      localStorage.setItem('wela_device_id', deviceId);

      await addDoc(collection(db, 'subscribers'), {
        deviceId,
        timestamp: serverTimestamp(),
        platform: navigator.platform,
        userAgent: navigator.userAgent
      });

      localStorage.setItem('wela_subscribed_v2', 'true');
      setIsFollowed(true);

      // Feedback imediato
      if (Notification.permission === 'granted') {
        new Notification("Acácias Wela", { 
          body: "Inscrição confirmada! Agora receberá alertas diretamente na sua barra de notificações.",
          icon: LOGO_URL 
        });
      } else {
        alert("Inscrição confirmada! Verifique se o seu telemóvel permite notificações deste site.");
      }

    } catch (e) {
      console.error("Erro ao seguir:", e);
    }
  };

  if (isFollowed) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button 
        onClick={handleFollow}
        className="bg-slate-900 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-emerald-600 transition-all border-4 border-white active:scale-90 group flex items-center gap-3"
      >
        <Bell className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
          Receber Alertas na Barra
        </span>
      </button>
    </div>
  );
};

const Footer = ({ config }: { config: SiteConfig | null }) => {
  const info = config?.contact || CONTACT_INFO;
  return (
    <footer className="bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <img src={LOGO_URL} className="h-16 w-auto bg-white p-2 rounded-xl" alt="Logo" />
            <div>
              <h2 className="text-xl font-black">Acacias <span className="text-emerald-400">Wela</span></h2>
              <p className="text-[8px] font-black uppercase text-emerald-400/50 tracking-[0.2em]">Benguela • Angola</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">
            Capacitando a juventude angolana através de treinamento profissional e desenvolvimento pessoal desde 2020.
          </p>
        </div>
        <div>
          <h4 className="font-black mb-6 text-[10px] uppercase tracking-widest text-slate-500">Navegação</h4>
          <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <li><a href="#/" className="hover:text-white transition-colors">Início</a></li>
            <li><a href="#/sobre" className="hover:text-white transition-colors">Sobre</a></li>
            <li><a href="#/blog" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-6 text-[10px] uppercase tracking-widest text-slate-500">Contactos</h4>
          <p className="text-xs font-bold text-slate-400 mb-2">{info.location}</p>
          <p className="text-xs font-bold text-emerald-400">{info.phone}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 flex flex-col items-center">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-8">
          &copy; {new Date().getFullYear()} Acácias Wela. Todos os direitos reservados.
        </p>
        <div className="bg-white/5 px-8 py-5 rounded-[2.5rem] border border-white/10 text-center max-w-2xl shadow-inner">
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Desenvolvido por <span className="text-white font-black">Henrique Lucas Biala</span> em colaboração com <span className="text-white font-black">Esmael Quivunza</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

const AppContent = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    siteService.getConfig().then(setSiteConfig);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}
      <SystemNotificationMonitor />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/contatos" element={<Contact />} />
          <Route path="/login" element={<Login user={null} />} />
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
