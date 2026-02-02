
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { ArrowRight, Loader2, Award, Users, Zap, Quote, Star, Sparkles } from 'lucide-react';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig } from '../types';

const { Link } = ReactRouterDom;

const Home: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posts, siteData] = await Promise.all([
          postService.getLatestPosts(3),
          siteService.getConfig()
        ]);
        setLatestPosts(posts);
        setConfig(siteData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  const hero = config?.hero || {
    title: 'Acácias Wela',
    subtitle: 'Transformando o futuro da juventude de Benguela através da capacitação prática.',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=2000',
    badge: 'Benguela • Angola'
  };

  const testimonials = config?.testimonials || [
    { id: '1', name: 'Moisés Biala', role: 'Ex-Formando', text: 'O Acácias Wela abriu portas que eu nem sabia que existiam em Benguela. Hoje sou profissional graças ao apoio deles.' },
    { id: '2', name: 'Sara Quivunza', role: 'Empreendedora', text: 'Aprendi não só informática, mas como gerir o meu próprio negócio. Impacto real!' }
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section - Animação Pulse-Slow adicionada */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0 scale-105 animate-pulse-slow">
          <img src={hero.imageUrl} className="w-full h-full object-cover brightness-[0.25]" alt="Hero" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/90"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-500/20 backdrop-blur-xl border border-white/10 rounded-full text-emerald-400 text-xs font-black mb-10 tracking-[0.3em] uppercase">
            <Sparkles size={16} /> {hero.badge}
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
            Acácias <span className="text-emerald-500">Wela</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/sobre" className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-6 rounded-[2rem] font-black hover:bg-emerald-700 transition-all hover:scale-105 shadow-2xl shadow-emerald-900/40 text-lg uppercase tracking-widest">
              Nossa História
            </Link>
            <Link to="/ajudar" className="w-full sm:w-auto bg-white/5 backdrop-blur-md text-white border border-white/20 px-12 py-6 rounded-[2rem] font-black hover:bg-white/10 transition-all text-lg uppercase tracking-widest">
              Como Ajudar
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Impacto */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Capacitação Local</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Porquê as Acácias?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Treino Prático", desc: "Formações intensivas viradas para o mercado real de Angola." },
              { icon: Users, title: "Mentoria", desc: "Acompanhamento próximo por líderes e co-fundadores." },
              { icon: Award, title: "Futuro", desc: "Inserção no mercado e criação de auto-emprego." }
            ].map((item, i) => (
              <div key={i} className="group bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-700">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-600 mb-10 group-hover:rotate-6 transition duration-500 shadow-lg border border-slate-50">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vidas Transformadas (Testemunhos) */}
      <section className="py-32 bg-slate-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
           <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
              <div className="max-w-xl">
                 <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Prova Social</span>
                 <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Vidas Transformadas</h2>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <Star className="text-amber-500 fill-amber-500" />
                    <span className="font-black text-sm">2000+ Jovens</span>
                 </div>
              </div>
           </header>
           
           <div className="grid md:grid-cols-2 gap-12">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-5 text-slate-900 group-hover:scale-125 transition duration-1000"><Quote size={80} /></div>
                   <div className="flex items-center gap-6 mb-10">
                      <img src={t.imageUrl || `https://ui-avatars.com/api/?name=${t.name}&background=10b981&color=fff`} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                      <div>
                         <h4 className="font-black text-slate-900 text-xl">{t.name}</h4>
                         <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">{t.role}</p>
                      </div>
                   </div>
                   <p className="text-slate-600 text-xl font-medium leading-relaxed italic">"{t.text}"</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter">Pronto para dar o passo?</h2>
          <div className="flex flex-wrap justify-center gap-6">
             <Link to="/blog" className="bg-emerald-600 px-12 py-6 rounded-[2rem] font-black text-lg flex items-center gap-4 hover:bg-emerald-700 transition">
                Ver Notícias <ArrowRight />
             </Link>
             <Link to="/contatos" className="bg-white/10 border border-white/20 px-12 py-6 rounded-[2rem] font-black text-lg hover:bg-white/20 transition">
                Falar Connosco
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
