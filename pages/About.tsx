
import React, { useEffect, useState } from 'react';
import { Calendar, Users, Heart, Target, Loader2 } from 'lucide-react';
import { siteService } from '../services/siteService';
import { SiteConfig } from '../types';

const About: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteService.getConfig().then(data => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  const aboutData = config?.about || {
    title: 'Quem Somos',
    text: 'O Acácias Wela é um projeto juvenil focado no treinamento profissional e pessoal, sediado em Benguela e criado oficialmente no dia 8 de Março de 2020.',
    missionQuote: 'Pretendemos continuar a crescer em todas as áreas, elevando o nome de Benguela e o potencial de Angola.',
    founders: [
      { name: 'Emília Wandessa', role: 'Cofundadora' },
      { name: 'Ana Binga', role: 'Cofundadora' },
      { name: 'Edgar Reinaldo', role: 'Cofundador' }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <section className="bg-slate-900 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter">Nossa História em Benguela</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Uma jornada de capacitação e impacto dedicada à juventude angolana.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            <header className="mb-16">
              <div className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] py-1 px-4 rounded-full inline-block mb-6">Manifesto Wela</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">{aboutData.title}</h2>
              <div className="text-slate-600 text-xl leading-relaxed font-medium space-y-6">
                {aboutData.text.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </header>
            
            <div className="bg-emerald-50 p-12 md:p-16 rounded-[4rem] my-20 border border-emerald-100 relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 text-emerald-900"><Target className="w-32 h-32" /></div>
              <h3 className="text-2xl font-black text-emerald-800 mb-8 flex items-center gap-4">
                <Target className="w-8 h-8" /> Nossa Ambição
              </h3>
              <p className="text-emerald-900/80 italic text-2xl md:text-3xl leading-relaxed font-bold tracking-tight">
                "{aboutData.missionQuote}"
              </p>
            </div>

            <div className="space-y-12">
               <h2 className="text-4xl font-black text-slate-900 text-center mb-16">Os Rostos por Trás do Projeto</h2>
               <div className="grid md:grid-cols-3 gap-10">
                {aboutData.founders.map((founder, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-48 h-48 rounded-[3rem] mx-auto mb-8 overflow-hidden border-4 border-slate-50 shadow-xl shadow-slate-200 group-hover:scale-105 transition duration-500">
                      <img 
                        src={founder.imageUrl || `https://ui-avatars.com/api/?name=${founder.name}&background=10b981&color=fff`} 
                        alt={founder.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-black text-slate-900 text-2xl mb-2">{founder.name}</h4>
                    <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">{founder.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-24 mt-24 border-t border-slate-100">
              <h3 className="text-3xl font-black text-slate-900 mb-12 text-center">Nosso Legado em Números</h3>
              <div className="grid md:grid-cols-3 gap-8">
                 {[
                   { icon: Calendar, label: "Anos de Impacto", val: "5+" },
                   { icon: Users, label: "Jovens Capacitados", val: "2000+" },
                   { icon: Heart, label: "Projetos Ativos", val: "12" }
                 ].map((stat, i) => (
                   <div key={i} className="bg-slate-50 p-10 rounded-[2.5rem] text-center border border-slate-100">
                     <stat.icon className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                     <div className="text-4xl font-black text-slate-900 mb-2">{stat.val}</div>
                     <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{stat.label}</div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;