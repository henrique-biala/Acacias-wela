
import React, { useState, useEffect } from 'react';
import { Heart, Landmark, Users, CheckCircle, Copy, Loader2, Sparkles, Send } from 'lucide-react';
import { siteService } from '../services/siteService';
import { SiteConfig } from '../types';

const Help: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState(false);

  useEffect(() => {
    siteService.getConfig().then(data => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const copyIban = () => {
    if (!config?.help?.iban) return;
    navigator.clipboard.writeText(config.help.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
    </div>
  );

  const helpInfo = config?.help || {
    iban: 'AO06 0000 0000 0000 0000 0',
    bankName: 'Banco Local',
    accountHolder: 'Acácias Wela',
    volunteerText: 'Estamos sempre à procura de mentes brilhantes para dar formações aos nossos jovens.'
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Refinado */}
      <section className="bg-slate-900 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-8">
            <Heart size={14} /> Juntos Somos Mais Fortes
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Sê Parte da Mudança</h1>
          <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            O seu apoio ajuda a manter as nossas portas abertas e os nossos jovens capacitados em Benguela.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Cartão de Doação */}
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="bg-emerald-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-8">
                <Landmark size={32} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Doação Direta</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                Contribuímos para a compra de materiais didáticos e manutenção da nossa sede em Benguela.
              </p>
              
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Titular</label>
                  <p className="text-xl font-black text-slate-800">{helpInfo.accountHolder}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Banco</label>
                  <p className="text-xl font-black text-slate-800">{helpInfo.bankName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">IBAN (Angola)</label>
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <p className="text-lg font-black text-emerald-600 break-all">{helpInfo.iban}</p>
                    <button 
                      onClick={copyIban}
                      className="shrink-0 p-3 bg-white border border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition"
                    >
                      {copied ? <CheckCircle className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-emerald-700 font-bold text-center">
              Qualquer valor faz a diferença na vida de um jovem.
            </div>
          </div>

          {/* Cartão de Voluntariado */}
          <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white flex flex-col justify-between">
            <div>
              <div className="bg-white/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-emerald-400 mb-8">
                <Users size={32} />
              </div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">Quero ser Voluntário</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                {helpInfo.volunteerText}
              </p>
              
              {!volunteerForm ? (
                <button 
                  onClick={() => setVolunteerForm(true)}
                  className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-lg hover:bg-emerald-700 transition shadow-xl"
                >
                  Candidate-se Agora
                </button>
              ) : (
                <form className="space-y-4 animate-in fade-in zoom-in-95" onSubmit={(e) => { e.preventDefault(); alert('Candidatura enviada!'); setVolunteerForm(false); }}>
                  <input placeholder="Seu Nome" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-emerald-500 transition" required />
                  <input placeholder="Sua Especialidade (ex: Informática)" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-emerald-500 transition" required />
                  <textarea placeholder="Como gostaria de ajudar?" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-emerald-500 transition" required />
                  <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black flex items-center justify-center gap-2">
                    Enviar Candidatura <Send size={20} />
                  </button>
                </form>
              )}
            </div>
            
            <div className="mt-12 flex items-center gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/10">
               <div className="p-3 bg-emerald-500 rounded-full"><Sparkles className="text-white" /></div>
               <div>
                  <p className="font-black text-sm">Mentoria de Impacto</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Partilha o teu saber</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
