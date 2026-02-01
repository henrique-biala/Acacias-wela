
import React, { useEffect, useState } from 'react';
// Fix: Use namespace import for react-router-dom to resolve named export errors
import * as ReactRouterDom from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, Heart, Award, Loader2 } from 'lucide-react';
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

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src={config?.hero.imageUrl || "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=2000"} 
            className="w-full h-full object-cover brightness-[0.25] scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/90"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block px-5 py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-extrabold mb-10 tracking-widest uppercase">
            {config?.hero.badge || "Elevando o Potencial Juvenil"}
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            {config?.hero.title.split(' ').map((word, i) => (
              <span key={i} className={i === config.hero.title.split(' ').length - 1 ? "text-emerald-500" : ""}>{word} </span>
            )) || "Acácias Wela"}
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto leading-relaxed opacity-90 font-medium">
            {config?.hero.subtitle || "Transformando o futuro da juventude angolana através da capacitação prática."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/sobre" className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-extrabold hover:bg-emerald-700 transition transform hover:scale-105 shadow-2xl shadow-emerald-900/40">
              Conheça Nossa História
            </Link>
          </div>
        </div>
      </section>

      {/* History Brief */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] py-1 px-4 rounded-full inline-block mb-6">Nossa Origem</div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 leading-tight">
                {config?.about.title || "5 Anos Elevando o Nível da Nossa Juventude"}
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">
                {config?.about.text || "Fundado por Ana Binga, Edgar Reinaldo e Wandi Ernesto, o projeto nasceu para capacitar jovens angolanos."}
              </p>
              <Link to="/sobre" className="text-emerald-600 font-bold flex items-center gap-3 hover:gap-5 transition-all text-sm uppercase tracking-widest">
                Ver biografia completa <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800" className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MVV Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-black">Nossos Pilares</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Award, title: "Empreendedorismo", color: "emerald", desc: "Criamos a mentalidade necessária para transformar ideias em negócios." },
              { icon: Users, title: "Desenvolvimento", color: "sky", desc: "Aperfeiçoamento das habilidades interpessoais e profissionais." },
              { icon: Zap, title: "Capacitação", color: "amber", desc: "Treinamentos intensivos focados no mercado real." }
            ].map((pilar, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className={`bg-${pilar.color}-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition duration-500`}>
                  <pilar.icon className={`text-${pilar.color}-600 w-10 h-10`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{pilar.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{pilar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
