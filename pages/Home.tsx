
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
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
    badge: 'Benguela • Angola',
    homeTitle: 'Potencializando Jovens Angolanos',
    homeBio: 'Fundado em Benguela por Emília Wandessa, o Acácias Wela nasceu para dar voz e ferramentas reais para a juventude local.'
  };

  return (
    <div className="flex flex-col w-full">
      {/* Banner Principal */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero.imageUrl} 
            className="w-full h-full object-cover brightness-[0.25]"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/90"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block px-5 py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-extrabold mb-10 tracking-widest uppercase">
            {hero.badge}
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            Acácias <span className="text-emerald-500">Wela</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto font-medium">
            {hero.subtitle}
          </p>
          <Link to="/sobre" className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-extrabold hover:bg-emerald-700 transition transform hover:scale-105 shadow-2xl shadow-emerald-900/40">
            Nossa História em Benguela
          </Link>
        </div>
      </section>

      {/* Biografia Dinâmica na Home */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <div className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] py-1 px-4 rounded-full inline-block mb-6">Nossa Origem</div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 leading-tight">
                {hero.homeTitle || 'Potencializando Jovens Angolanos'}
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">
                {hero.homeBio || "Fundado em Benguela por Emília Wandessa, o Acácias Wela nasceu para dar voz e ferramentas reais para a juventude local."}
              </p>
              <Link to="/sobre" className="text-emerald-600 font-bold flex items-center gap-3 hover:gap-5 transition-all text-sm uppercase tracking-widest">
                Biografia Completa <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] animate-in fade-in slide-in-from-right duration-700">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800" className="w-full h-full object-cover" alt="Benguela" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;