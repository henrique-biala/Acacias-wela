
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { siteService } from './services/siteService';
import { LOGO_URL, SOCIAL_LINKS, CONTACT_INFO } from './constants';
import { Facebook, MessageCircle, Send, X, Loader2, Sparkles } from 'lucide-react';
import { SiteConfig } from './types';
import { GoogleGenAI } from '@google/genai';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Help from './pages/Help';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const { HashRouter, Routes, Route, Navigate, useLocation } = ReactRouterDom;

const Footer = ({ config }: { config: SiteConfig | null }) => {
  const info = config?.contact || CONTACT_INFO;
  return (
    <footer className="bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
        <div className="col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <img src={LOGO_URL} className="h-16 w-auto bg-white p-2 rounded-xl" alt="Logo" />
            <div>
              <h2 className="text-xl font-black text-white">Acacias <span className="text-emerald-400">Wela</span></h2>
              <p className="text-[8px] font-black uppercase text-emerald-400/50 tracking-[0.2em]">Benguela • Angola</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed font-medium">Capacitando a juventude angolana através de treinamento profissional e desenvolvimento pessoal.</p>
          <div className="flex gap-4">
            <a href={config?.contact?.facebook || SOCIAL_LINKS.facebook} target="_blank" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all"><Facebook /></a>
          </div>
        </div>
        <div>
          <h4 className="font-black mb-6 text-[10px] uppercase tracking-widest text-slate-500">Links Úteis</h4>
          <ul className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <li><a href="#/" className="hover:text-white transition">Início</a></li>
            <li><a href="#/sobre" className="hover:text-white transition">Sobre</a></li>
            <li><a href="#/ajudar" className="hover:text-emerald-400 transition">Como Ajudar</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-6 text-[10px] uppercase tracking-widest text-slate-500">Contacto</h4>
          <p className="text-xs font-bold text-slate-400 mb-2">{info.location}</p>
          <p className="text-xs font-bold text-emerald-400">{info.phone}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 flex flex-col items-center">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-8">&copy; {new Date().getFullYear()} Acácias Wela. Todos os direitos reservados.</p>
        <div className="bg-white/5 px-8 py-6 rounded-[2.5rem] border border-white/10 text-center max-w-2xl">
          <p className="text-[12px] text-slate-300 font-medium">
            Desenvolvido por <a href="https://www.facebook.com/profile.php?id=100087650157066" target="_blank" className="text-emerald-400 font-black hover:underline">Henrique Lucas Biala</a> & <span className="text-white font-black">Esmael Quivunza</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

const AppContent = () => {
  const [user, setUser] = useState<any>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    // Carrega configuração apenas uma vez no início da aplicação
    siteService.getConfig().then(setSiteConfig);
    window.scrollTo(0, 0);
    return () => unsubscribe();
  }, []); 

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar config={siteConfig} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home config={siteConfig} />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/contatos" element={<Contact />} />
          <Route path="/ajudar" element={<Help />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/admin/*" element={<AdminDashboard onConfigUpdate={setSiteConfig} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
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
