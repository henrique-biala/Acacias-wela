
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, Heart, Award } from 'lucide-react';
import { postService } from '../services/postService';
import { Post } from '../types';
import { PROJECTS } from '../constants';

const Home: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await postService.getLatestPosts(3);
        setLatestPosts(posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.25] scale-105"
            alt="Jovens em treinamento"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/90"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block px-5 py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-full text-emerald-400 text-xs md:text-sm font-extrabold mb-10 animate-in fade-in zoom-in duration-1000 tracking-widest uppercase">
            Elevando o Potencial Juvenil
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 animate-in slide-in-from-bottom-12 duration-1000 leading-[1.1] tracking-tighter">
            Acácias <span className="text-emerald-500">Wela</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-16 duration-1000 opacity-90 font-medium">
            Transformando o futuro da juventude angolana através da capacitação prática, arte e empreendedorismo inovador.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-in slide-in-from-bottom-20 duration-1000 delay-300">
            <Link to="/sobre" className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-extrabold hover:bg-emerald-700 transition transform hover:scale-105 shadow-2xl shadow-emerald-900/40 text-sm md:text-lg">
              Conheça Nossa História
            </Link>
            <Link to="/contatos" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-3xl font-extrabold hover:bg-white/20 transition transform hover:scale-105 shadow-2xl text-sm md:text-lg">
              Junte-se a Nós
            </Link>
          </div>
        </div>
      </section>

      {/* History Brief */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] py-1 px-4 rounded-full inline-block mb-6">Nossa Origem</div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 leading-tight">5 Anos Elevando o Nível da Nossa Juventude</h2>
              <p className="text-slate-500 text-lg md:text-xl mb-8 leading-relaxed font-medium">
                Fundado por <strong>Ana Binga, Edgar Reinaldo e Wandi Ernesto</strong>, o projeto Acácias Wela nasceu com o propósito inabalável de capacitar jovens angolanos para o sucesso real.
              </p>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <div className="text-4xl font-black text-slate-900">5+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Anos de Impacto Social</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-slate-900">100%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Foco no Futuro</div>
                </div>
              </div>
              <div className="mt-12">
                <Link to="/sobre" className="text-emerald-600 font-bold flex items-center gap-3 hover:gap-5 transition-all text-sm uppercase tracking-widest">
                  Ver biografia completa <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="relative z-10 overflow-hidden rounded-[3rem] shadow-2xl aspect-square md:aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover"
                  alt="Equipe Acácias Wela"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-50 rounded-full -z-0 blur-3xl opacity-60"></div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-sky-50 rounded-full -z-0 blur-3xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* MVV Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Nossos Pilares</h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">A base que sustenta cada ação do nosso projeto.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Award, title: "Empreendedorismo", color: "emerald", desc: "Criamos a mentalidade necessária para transformar ideias em negócios sustentáveis." },
              { icon: Users, title: "Desenvolvimento", color: "sky", desc: "Aperfeiçoamento contínuo das habilidades interpessoais e profissionais." },
              { icon: Zap, title: "Capacitação", color: "amber", desc: "Treinamentos intensivos focados no que o mercado realmente exige." }
            ].map((pilar, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className={`bg-${pilar.color}-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition duration-500`}>
                  <pilar.icon className={`text-${pilar.color}-600 w-10 h-10`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{pilar.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {pilar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="text-left">
              <div className="bg-sky-50 text-sky-600 font-black text-[10px] uppercase tracking-[0.3em] py-1 px-4 rounded-full inline-block mb-6">Mural de Notícias</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Últimas do Blog</h2>
            </div>
            <Link to="/blog" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-600 transition shadow-xl text-sm">
              Ir para o Blog <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {latestPosts.length > 0 ? (
              latestPosts.map(post => (
                <article key={post.id} className="flex flex-col h-full bg-slate-50 rounded-[3rem] overflow-hidden hover:translate-y-[-10px] transition-all duration-500 shadow-sm border border-slate-100 group">
                  <div className="h-60 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <span className="text-[10px] font-black text-emerald-600 uppercase mb-4 tracking-widest">{post.category}</span>
                    <h3 className="text-2xl font-bold mb-5 line-clamp-2 text-slate-800 leading-tight group-hover:text-emerald-600 transition">{post.title}</h3>
                    <div 
                      className="text-slate-500 text-base line-clamp-3 mb-8 leading-relaxed font-medium"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className="mt-auto pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      <span>{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                      <Link to="/blog" className="text-emerald-600 hover:text-emerald-700">Ler Tudo</Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                Aguardando novas histórias...
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
