
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

const WelaAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const askAi = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'ai', text: 'A chave API não foi encontrada. Se estás no Netlify, configura a variável GEMINI_API_KEY nas definições de ambiente.' }]);
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: 'És o Assistente Inteligente do projeto social Acácias Wela em Benguela, Angola. Teu objetivo é ajudar jovens a saber sobre cursos, missões e como apoiar o projeto. Responde sempre em português de Angola, de forma amigável, educada e inspiradora. Os fundadores são Edgar Reinaldo, Emília Wandessa e Ana Binga.'
        }
      });
      
      // PROPRIEDADE .text (Getter), não função. Essencial para funcionar.
      const aiText = response.text || 'Desculpa, tive um pequeno problema técnico. Podes tentar de novo?';
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      console.error("Erro na Wela IA:", err);
      setMessages(prev => [...prev, { role: 'ai', text: 'Estou a descansar um pouco. Podes contactar a nossa equipa diretamente pelo WhatsApp!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-8 z-[150] flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-white w-[320px] h-[480px] rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
          <header className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20"><Sparkles size={16} /></div>
              <span className="font-black text-[10px] uppercase tracking-widest">Wela IA</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={18} /></button>
          </header>
          <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50">
            {messages.length === 0 && (
              <p className="text-slate-400 text-sm italic text-center py-10">Olá! Estou aqui para te ajudar a conhecer melhor as Acácias Wela. O que queres saber?</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'bg-white border text-slate-700 shadow-sm font-medium'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-start p-2"><Loader2 className="animate-spin text-emerald-500 w-5 h-5" /></div>}
          </div>
          <form onSubmit={askAi} className="p-4 border-t bg-white flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Escreve aqui..." 
              className="flex-grow bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-emerald-500/20 transition-all" 
            />
            <button type="submit" className="bg-slate-900 text-white p-3 rounded-xl hover:bg-emerald-600 transition shadow-lg"><Send size={18} /></button>
          </form>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-emerald-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white group"
      >
        {isOpen ? <X /> : <MessageCircle className="group-hover:rotate-12 transition-transform" />}
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
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home config={siteConfig} />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/contatos" element={<Contact />} />
          <Route path="/ajudar" element={<Help />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPath && <WelaAssistant />}
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
