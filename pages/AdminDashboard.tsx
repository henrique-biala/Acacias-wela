
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, Layout, Info, Phone, Send, Landmark, Quote, Facebook
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, LOGO_URL, CONTACT_INFO } from '../constants';

const { useNavigate } = ReactRouterDom;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'hero' | 'about' | 'projects' | 'contact' | 'help' | 'testimonials'>('blog');
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [blogData, setBlogData] = useState({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allPosts, config] = await Promise.all([
        postService.getAllPosts(),
        siteService.getConfig()
      ]);
      setPosts(allPosts);
      
      const defaultState: SiteConfig = {
        hero: { title: 'Acácias Wela', subtitle: '', imageUrl: '', badge: 'Benguela' },
        about: { title: 'Sobre Nós', text: '', missionQuote: '', founders: [] },
        contact: { email: CONTACT_INFO.email, phone: CONTACT_INFO.phone, location: CONTACT_INFO.location, facebook: '' },
        help: { iban: '', bankName: '', accountHolder: '', volunteerText: '' },
        projects: DEFAULT_PROJECTS,
        testimonials: []
      };

      setSiteConfig(config ? { ...defaultState, ...config } : defaultState);
    } catch (err) { 
      console.error("Erro ao carregar admin:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSaveConfig = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Informações guardadas com sucesso! O site já foi atualizado.');
    } catch (e) { 
      alert('Erro ao guardar as alterações. Verifica a tua ligação.'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleMediaUpload = async (file: File) => {
    try { return await postService.uploadMedia(file); } catch (e) { return ""; }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 flex-col gap-6">
      <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      <span className="text-slate-500 font-black text-xs uppercase tracking-widest">A carregar Painel Acácias...</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5 flex flex-col items-center md:items-start gap-2">
           <img src={LOGO_URL} className="w-10 h-10 bg-white p-1 rounded-lg" alt="Logo" />
           <h2 className="hidden md:block text-emerald-400 font-black text-lg tracking-tight">WELA ADMIN</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'blog', icon: FileText, label: 'Notícias / Blog' },
            { id: 'hero', icon: Layout, label: 'Banner de Entrada' },
            { id: 'about', icon: Info, label: 'Página Sobre' },
            { id: 'projects', icon: Briefcase, label: 'Nossos Projetos' },
            { id: 'testimonials', icon: Quote, label: 'Depoimentos' },
            { id: 'help', icon: Landmark, label: 'Apoio / IBAN' },
            { id: 'contact', icon: Phone, label: 'Contactos' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <tab.icon size={20} /> <span className="hidden md:inline text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center justify-center md:justify-start gap-4 p-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl font-bold">
            <LogOut size={20} /> <span className="hidden md:inline text-sm">Sair do Painel</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-6 md:p-12 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Aba Blog */}
          {activeTab === 'blog' && (
             <div className="animate-in fade-in duration-500 space-y-8">
                <div className="flex justify-between items-center">
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight">Publicações</h1>
                   <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all">Novo Artigo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {posts.map(p => (
                     <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-6 group hover:shadow-md transition">
                        <img src={p.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-slate-800 truncate">{p.title}</h3>
                           <p className="text-[10px] font-black uppercase text-emerald-600">{p.category}</p>
                        </div>
                        <button onClick={() => p.id && confirm('Eliminar este post definitivamente?') && postService.deletePost(p.id).then(fetchData)} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition"><Trash2 size={20} /></button>
                     </div>
                   ))}
                   {posts.length === 0 && <p className="col-span-2 text-center text-slate-400 py-10">Nenhuma notícia publicada ainda.</p>}
                </div>
             </div>
          )}

          {/* Abas Dinâmicas de Configuração (Hero, About, etc) */}
          {activeTab !== 'blog' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-end">
                  <h1 className="text-4xl font-black text-slate-900 capitalize tracking-tight">Editar {activeTab}</h1>
                  <button onClick={handleSaveConfig} disabled={submitting} className="bg-emerald-600 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-lg flex items-center gap-3 hover:bg-emerald-700 transition-all">
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Guardar Tudo
                  </button>
               </div>

               {activeTab === 'hero' && (
                 <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título Grande</label>
                       <input value={siteConfig.hero.title} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black text-xl border-none outline-none focus:ring-2 ring-emerald-500/20" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Subtítulo (O que fazemos)</label>
                       <textarea rows={3} value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium border-none outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Badge (Localização/Destaque)</label>
                       <input value={siteConfig.hero.badge} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, badge: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold border-none outline-none" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Imagem Principal</label>
                       <div className="h-64 rounded-[2rem] overflow-hidden border-2 border-slate-100 relative group">
                          <img src={siteConfig.hero.imageUrl} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer font-black transition">
                             ALTERAR FOTO
                             <input type="file" className="hidden" accept="image/*" onChange={async e => {
                               if(e.target.files?.[0]) {
                                  const url = await handleMediaUpload(e.target.files[0]);
                                  setSiteConfig({...siteConfig, hero: {...siteConfig.hero, imageUrl: url}});
                               }
                             }} />
                          </label>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'about' && (
                 <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título da Página</label>
                       <input value={siteConfig.about.title} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, title: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black text-xl border-none outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Texto Principal (Manifesto)</label>
                       <textarea rows={8} value={siteConfig.about.text} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, text: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium border-none outline-none leading-relaxed" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Frase de Missão (Citação)</label>
                       <textarea rows={3} value={siteConfig.about.missionQuote} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, missionQuote: e.target.value}})} className="w-full bg-emerald-50 px-6 py-4 rounded-2xl font-bold italic border-none outline-none text-emerald-900" />
                    </div>
                    
                    <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Fundadores</label>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {siteConfig.about.founders.map((f, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                               <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto relative group">
                                  <img src={f.imageUrl || `https://ui-avatars.com/api/?name=${f.name}&background=10b981&color=fff`} className="w-full h-full object-cover" />
                                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-white cursor-pointer font-black transition">
                                     FOTO
                                     <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                       if(e.target.files?.[0]) {
                                          const url = await handleMediaUpload(e.target.files[0]);
                                          const newF = [...siteConfig.about.founders];
                                          newF[i].imageUrl = url;
                                          setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                                       }
                                     }} />
                                  </label>
                               </div>
                               <input placeholder="Nome" value={f.name} onChange={e => {
                                 const newF = [...siteConfig.about.founders];
                                 newF[i].name = e.target.value;
                                 setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                               }} className="w-full bg-white px-4 py-2 rounded-xl text-xs font-bold border-none outline-none" />
                               <input placeholder="Cargo" value={f.role} onChange={e => {
                                 const newF = [...siteConfig.about.founders];
                                 newF[i].role = e.target.value;
                                 setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                               }} className="w-full bg-white px-4 py-2 rounded-xl text-[10px] font-medium border-none outline-none" />
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'projects' && (
                 <div className="space-y-8">
                    {siteConfig.projects.map((p, i) => (
                      <div key={p.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
                         <div className="flex justify-between items-center">
                            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Projeto #{i+1}</h3>
                            <button onClick={() => setSiteConfig({...siteConfig, projects: siteConfig.projects.filter(item => item.id !== p.id)})} className="p-3 text-rose-400 bg-rose-50 rounded-xl hover:bg-rose-100 transition"><Trash2 size={18} /></button>
                         </div>
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título do Projeto</label>
                                  <input value={p.title} onChange={e => {
                                    const newP = [...siteConfig.projects];
                                    newP[i].title = e.target.value;
                                    setSiteConfig({...siteConfig, projects: newP});
                                  }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold border-none outline-none" />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Impacto (Badge)</label>
                                  <input value={p.impact} onChange={e => {
                                    const newP = [...siteConfig.projects];
                                    newP[i].impact = e.target.value;
                                    setSiteConfig({...siteConfig, projects: newP});
                                  }} className="w-full bg-sky-50 px-6 py-4 rounded-2xl font-bold text-sky-700 border-none outline-none" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Imagem do Projeto</label>
                               <div className="h-40 rounded-3xl overflow-hidden border-2 border-slate-100 relative group">
                                  <img src={p.image} className="w-full h-full object-cover" />
                                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer font-black transition text-xs">
                                     ALTERAR
                                     <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                       if(e.target.files?.[0]) {
                                          const url = await handleMediaUpload(e.target.files[0]);
                                          const newP = [...siteConfig.projects];
                                          newP[i].image = url;
                                          setSiteConfig({...siteConfig, projects: newP});
                                       }
                                     }} />
                                  </label>
                               </div>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição Detalhada</label>
                            <textarea rows={4} value={p.description} onChange={e => {
                              const newP = [...siteConfig.projects];
                              newP[i].description = e.target.value;
                              setSiteConfig({...siteConfig, projects: newP});
                            }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium border-none outline-none leading-relaxed" />
                         </div>
                      </div>
                    ))}
                    <button onClick={() => setSiteConfig({...siteConfig, projects: [...siteConfig.projects, { id: Date.now().toString(), title: '', description: '', image: '', impact: 'Novo Impacto' }]})} className="w-full border-2 border-dashed border-emerald-500/40 text-emerald-600 py-10 rounded-[3.5rem] font-black flex items-center justify-center gap-3 hover:bg-emerald-50 transition uppercase tracking-widest text-xs">
                       <Plus /> Criar Novo Projeto
                    </button>
                 </div>
               )}

               {activeTab === 'testimonials' && (
                 <div className="space-y-6">
                    {siteConfig.testimonials.map((t, i) => (
                      <div key={t.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-left-2">
                         <div className="flex gap-4">
                            <div className="flex-1 space-y-4">
                               <input placeholder="Nome Completo" value={t.name} onChange={e => {
                                 const newT = [...siteConfig.testimonials];
                                 newT[i].name = e.target.value;
                                 setSiteConfig({...siteConfig, testimonials: newT});
                               }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold border-none outline-none" />
                               <input placeholder="Cargo / Função (ex: Ex-Formando)" value={t.role} onChange={e => {
                                 const newT = [...siteConfig.testimonials];
                                 newT[i].role = e.target.value;
                                 setSiteConfig({...siteConfig, testimonials: newT});
                               }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl text-xs font-bold text-emerald-600 border-none outline-none" />
                            </div>
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 relative group shrink-0">
                               <img src={t.imageUrl || `https://ui-avatars.com/api/?name=${t.name}&background=10b981&color=fff`} className="w-full h-full object-cover" />
                               <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-white cursor-pointer font-black transition">
                                  FOTO
                                  <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                    if(e.target.files?.[0]) {
                                       const url = await handleMediaUpload(e.target.files[0]);
                                       const newT = [...siteConfig.testimonials];
                                       newT[i].imageUrl = url;
                                       setSiteConfig({...siteConfig, testimonials: newT});
                                    }
                                  }} />
                               </label>
                            </div>
                            <button onClick={() => setSiteConfig({...siteConfig, testimonials: siteConfig.testimonials.filter(item => item.id !== t.id)})} className="p-4 text-rose-400 bg-rose-50 rounded-2xl hover:bg-rose-100 transition h-fit"><Trash2 /></button>
                         </div>
                         <textarea placeholder="Relato da experiência no projeto..." rows={4} value={t.text} onChange={e => {
                           const newT = [...siteConfig.testimonials];
                           newT[i].text = e.target.value;
                           setSiteConfig({...siteConfig, testimonials: newT});
                         }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl italic border-none outline-none font-medium leading-relaxed" />
                      </div>
                    ))}
                    <button onClick={() => setSiteConfig({...siteConfig, testimonials: [...siteConfig.testimonials, { id: Date.now().toString(), name: '', role: 'Ex-Formando', text: '' }]})} className="w-full border-2 border-dashed border-emerald-500/40 text-emerald-600 py-10 rounded-[3.5rem] font-black flex items-center justify-center gap-3 hover:bg-emerald-50 transition uppercase tracking-widest text-xs">
                       <Plus /> Adicionar Depoimento Real
                    </button>
                 </div>
               )}

               {activeTab === 'help' && (
                  <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-200 space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">IBAN Oficial (Benguela)</label>
                        <input value={siteConfig.help.iban} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, iban: e.target.value}})} className="w-full bg-emerald-50 px-8 py-5 rounded-[1.5rem] font-black text-emerald-700 border-none outline-none text-xl" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome do Banco</label>
                        <input value={siteConfig.help.bankName} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, bankName: e.target.value}})} className="w-full bg-slate-50 px-8 py-5 rounded-[1.5rem] font-bold border-none outline-none" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Titular da Conta</label>
                        <input value={siteConfig.help.accountHolder} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, accountHolder: e.target.value}})} className="w-full bg-slate-50 px-8 py-5 rounded-[1.5rem] font-bold border-none outline-none" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Texto de Voluntariado</label>
                        <textarea rows={4} value={siteConfig.help.volunteerText} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, volunteerText: e.target.value}})} className="w-full bg-slate-50 px-8 py-5 rounded-[1.5rem] font-medium border-none outline-none" />
                     </div>
                  </div>
               )}

               {activeTab === 'contact' && (
                  <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-200 space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail de Contacto</label>
                           <input value={siteConfig.contact.email} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, email: e.target.value}})} className="w-full bg-slate-50 px-8 py-5 rounded-[1.5rem] font-bold border-none outline-none" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp / Telefone</label>
                           <input value={siteConfig.contact.phone} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value}})} className="w-full bg-slate-50 px-8 py-5 rounded-[1.5rem] font-bold border-none outline-none" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Localização Física</label>
                        <input value={siteConfig.contact.location} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, location: e.target.value}})} className="w-full bg-slate-50 px-8 py-5 rounded-[1.5rem] font-bold border-none outline-none" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link do Facebook</label>
                        <input value={siteConfig.contact.facebook} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, facebook: e.target.value}})} className="w-full bg-slate-50 px-8 py-5 rounded-[1.5rem] font-bold border-none outline-none" />
                     </div>
                  </div>
               )}
            </div>
          )}
        </div>
      </main>

      {/* Modal Editor Blog */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[500] flex items-center justify-center p-4 md:p-12">
          <div className="bg-white w-full max-w-5xl h-full md:h-[90vh] rounded-[4rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
             <header className="px-10 py-8 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900">Nova Publicação</h3>
                <button onClick={() => setIsEditorOpen(false)} className="p-4 hover:bg-slate-100 rounded-2xl transition shadow-sm"><X /></button>
             </header>
             <div className="flex-grow overflow-y-auto p-12 space-y-10 no-scrollbar">
                <input placeholder="Título da Notícia..." value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-5xl font-black w-full outline-none placeholder:text-slate-100 text-slate-900 tracking-tighter" />
                
                <label className="flex flex-col items-center justify-center p-16 border-4 border-dashed border-slate-100 rounded-[3.5rem] cursor-pointer hover:bg-slate-50 group transition-all">
                   <Camera className="w-16 h-16 text-slate-100 group-hover:text-emerald-500 mb-4 transition" />
                   <span className="font-black text-sm text-slate-400 uppercase tracking-widest">{blogImage ? 'Imagem Carregada!' : 'Selecionar Capa do Artigo'}</span>
                   <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                </label>
                
                <div ref={editorRef} contentEditable className="min-h-[400px] outline-none text-xl leading-relaxed text-slate-600 font-medium bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100" />
             </div>
             <footer className="p-10 border-t flex justify-end gap-6 bg-slate-50">
                <button onClick={() => setIsEditorOpen(false)} className="font-bold text-slate-400 px-8">Cancelar</button>
                <button onClick={async () => {
                   if (!blogImage || !blogData.title) return alert('É necessário um título e uma imagem de capa.');
                   setSubmitting(true);
                   try {
                     const content = editorRef.current?.innerHTML || '';
                     await postService.createPost({...blogData, content, imageUrl: ''}, blogImage, []);
                     setIsEditorOpen(false);
                     fetchData();
                   } finally { setSubmitting(false); }
                }} disabled={submitting} className="bg-emerald-600 text-white px-20 py-6 rounded-3xl font-black shadow-2xl text-lg hover:bg-emerald-700 transition-all">
                   {submitting ? <Loader2 className="animate-spin" /> : 'Publicar Agora'}
                </button>
             </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
