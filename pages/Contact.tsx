
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Fale Conosco</h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Dúvidas sobre os nossos cursos ou quer ser um parceiro? Estamos à disposição.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-slate-800">E-mail</h3>
              <p className="text-slate-600">contato@acaciaswela.org</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-sky-100 w-12 h-12 rounded-xl flex items-center justify-center text-sky-600 mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-slate-800">WhatsApp</h3>
              <p className="text-slate-600">+244 9XX XXX XXX</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-slate-800">Localização</h3>
              <p className="text-slate-600">Luanda, Angola</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-emerald-600" /> Envie uma Mensagem
              </h2>
              
              {sent ? (
                <div className="bg-emerald-50 text-emerald-700 p-8 rounded-3xl border border-emerald-100 text-center animate-in zoom-in-95 duration-300">
                  <div className="bg-emerald-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Mensagem Enviada!</h4>
                  <p className="text-emerald-600">Obrigado pelo seu interesse. Retornaremos em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 ml-1">Seu Nome</label>
                      <input 
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-emerald-500 outline-none transition"
                        placeholder="Nome Completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 ml-1">E-mail</label>
                      <input 
                        required
                        type="email"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-emerald-500 outline-none transition"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 ml-1">Assunto</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-emerald-500 outline-none transition">
                      <option>Inscrição em Cursos</option>
                      <option>Parcerias</option>
                      <option>Quero ser Voluntário</option>
                      <option>Outros Assuntos</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 ml-1">Mensagem</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-emerald-500 outline-none transition resize-none"
                      placeholder="Como podemos te ajudar?"
                    />
                  </div>

                  <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                    Enviar Mensagem <Send className="w-5 h-5" />
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
