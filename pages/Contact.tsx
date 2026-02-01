
import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import { siteService } from '../services/siteService';
import { SiteConfig } from '../types';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteService.getConfig().then(data => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  const contactInfo = config?.contact || {
    email: 'contato@acaciaswela.org',
    phone: '+244 9XX XXX XXX',
    location: 'Luanda, Angola'
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">Fale Connosco</h1>
          <p className="text-slate-500 text-xl font-medium leading-relaxed">
            Dúvidas sobre inscrições, parcerias ou quer ser um voluntário? A nossa equipa está pronta para ajudar.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-16 items-start">
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-emerald-900/5 transition duration-500">
              <div className="bg-emerald-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition duration-500">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="font-black text-2xl mb-2 text-slate-900 tracking-tight">E-mail</h3>
              <p className="text-slate-500 font-medium text-lg">{contactInfo.email}</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-sky-900/5 transition duration-500">
              <div className="bg-sky-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-sky-600 mb-8 group-hover:scale-110 transition duration-500">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="font-black text-2xl mb-2 text-slate-900 tracking-tight">WhatsApp</h3>
              <p className="text-slate-500 font-medium text-lg">{contactInfo.phone}</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-amber-900/5 transition duration-500">
              <div className="bg-amber-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition duration-500">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="font-black text-2xl mb-2 text-slate-900 tracking-tight">Localização</h3>
              <p className="text-slate-500 font-medium text-lg">{contactInfo.location}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[4rem] shadow-sm border border-slate-100 p-12 md:p-16">
              <h2 className="text-4xl font-black text-slate-900 mb-12 flex items-center gap-5 tracking-tight">
                <MessageSquare className="w-10 h-10 text-emerald-600" /> Envie Mensagem
              </h2>
              
              {sent ? (
                <div className="bg-emerald-50 text-emerald-700 p-16 rounded-[3rem] border border-emerald-100 text-center animate-in zoom-in-95 duration-500">
                  <div className="bg-emerald-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30">
                    <Send className="w-10 h-10" />
                  </div>
                  <h4 className="text-3xl font-black mb-4">Mensagem Enviada!</h4>
                  <p className="text-emerald-600 text-lg font-medium">Obrigado pelo seu interesse. Retornaremos em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Seu Nome</label>
                      <input 
                        required
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 ring-emerald-500/10 outline-none transition text-lg"
                        placeholder="Ex: João Silveira"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">E-mail</label>
                      <input 
                        required
                        type="email"
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 ring-emerald-500/10 outline-none transition text-lg"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Assunto</label>
                    <select className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 ring-emerald-500/10 outline-none transition text-lg font-bold">
                      <option>Inscrição em Cursos Acácias</option>
                      <option>Parcerias Institucionais</option>
                      <option>Voluntariado</option>
                      <option>Outros Assuntos</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Mensagem</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 ring-emerald-500/10 outline-none transition resize-none text-lg"
                      placeholder="Como podemos te ajudar?"
                    />
                  </div>

                  <button className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-xl hover:bg-emerald-600 transition shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98]">
                    Enviar Mensagem <Send className="w-6 h-6" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
