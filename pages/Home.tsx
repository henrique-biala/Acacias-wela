
import React, { useEffect, useState } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { ArrowRight, Loader2, Award, Users, Zap } from 'lucide-react';
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
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Carregando...</span>
      </div>
    </div>
  );

  const hero = config?.hero || {
    title: 'Acácias Wela',
    subtitle: 'Transformando o futuro da juventude de Benguela através da capacitação prática.',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=2000',
    badge: 'Benguela • Angola'
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Banner Principal Responsivo */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero.imageUrl} 
            className="w-full h-full object-cover brightness-[0.3]"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/90"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] md:text-xs font-extrabold mb-8 md:mb-10 tracking-widest uppercase">
            {hero.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-[1.1] tracking-tighter">
            Acácias <span className="text-emerald-500">Wela</span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-slate-300 mb-10 md:mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sobre" className="w-full sm:w-auto bg-emerald-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-extrabold hover:bg-emerald-700 transition transform hover:scale-105 shadow-2xl shadow-emerald-900/40 text-sm md:text-base text-center">
              Nossa História
            </Link>
            <Link to="/blog" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-3xl font-extrabold hover:bg-white/20 transition text-sm md:text-base text-center">
              Blog & Notícias
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Impacto Curta (Substitui a Bio que foi removida) */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">O Que Fazemos</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Capacitação em Benguela</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Zap, title: "Treinamento Prático", desc: "Focamos em habilidades reais que o mercado de trabalho exige hoje em Angola." },
              { icon: Users, title: "Impacto Coletivo", desc: "Mais do que alunos, formamos uma comunidade de líderes prontos para o futuro." },
              { icon: Award, title: "Certificação", desc: "Reconhecimento de competências adquiridas durante nossos cursos intensivos." }
            ].map((item, i) => (
              <div key={i} className="group bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition duration-500 shadow-sm">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chamada para o Blog */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Acompanhe nossas conquistas</h2>
            <p className="text-slate-400 text-lg font-medium">Veja as últimas fotos e vídeos dos nossos eventos e treinamentos em Benguela.</p>
          </div>
          <Link to="/blog" className="group bg-emerald-600 px-10 py-5 rounded-2xl font-black flex items-center gap-4 hover:bg-emerald-700 transition">
            Ir para o Blog <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
