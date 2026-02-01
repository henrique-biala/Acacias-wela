
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, ImageIcon, Layout, Info, Phone, Video, Bell, CheckCircle2
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig, Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, CONTACT_INFO, SOCIAL_LINKS } from '../constants';

const { useNavigate } = ReactRouterDom;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'hero' | 'about' | 'contact' | 'projects' | 'notifications'>('blog');
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Blog Form State
  const [blogData, setBlogData] = useState({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [blogGallery, setBlogGallery] = useState<File[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allPosts, config] = await Promise.all([
        postService.getAllPosts(),
        siteService.getConfig()
      ]);
      setPosts(allPosts);
      
      const defaultConfig: SiteConfig = {
        hero: { 
          title: 'Acácias Wela', 
          subtitle: 'Transformando o futuro da juventude de Benguela através da capacitação prática.', 
          imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=2000', 
          badge: 'Benguela • Angola'
        },
        about: { 
          title: 'Quem Somos', 
          text: 'O Acácias Wela é um projeto juvenil focado no treinamento profissional e pessoal, sediado em Benguela.', 
          missionQuote: 'Pretendemos continuar a crescer em todas as áreas.', 
          founders: [
            { name: 'Emília Wandessa', role: 'Cofundadora' },
            { name: 'Ana Binga', role: 'Cofundadora' },
            { name: 'Edgar Reinaldo', role: 'Cofundador' }
          ] 
        },
        contact: {
          ...CONTACT_INFO,
          facebook: SOCIAL_LINKS.facebook
        } as any,
        projects: DEFAULT_PROJECTS,
        notification: {
          active: false,
          message: 'Novas inscrições abertas para o curso de informática em Benguela!',
          type: 'info',
          link: '/blog'
        }
      };

      setSiteConfig(config || defaultConfig);
    } catch (err) {
      console.warn("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (file: File, isGallery: boolean = false) => {
    if (file.type.startsWith('video/')) {
       return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
       });
    }
    return await postService.uploadMedia(file, isGallery);
  };

  const handleSaveSite = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Tudo pronto! O site foi atualizado com sucesso.');
    } catch (err) {
      alert('Erro ao guardar configurações.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!blogImage || !blogData.title) return alert('Por favor, escolha uma foto de capa e um título.');
    
    setSubmitting(true);
    try {
      await postService.createPost({ ...blogData, content, imageUrl: '' }, blogImage, blogGallery);
      setIsEditorOpen(false);
      setBlogImage(null);
      setBlogGallery([]);
      setBlogData({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
      fetchData();
    } catch (err) {
      alert('Erro ao publicar post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <h2 className="hidden md:block text-xl font-black text-emerald-400">ADMIN WELA</h2>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
          <p className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-4">Comunicação</p>
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'blog' ? 'bg-emerald-600 shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:bg-white/5'}`}>
            <FileText /> <span className="hidden md:inline">Blog & Multimédia</span>
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'notifications' ? 'bg-rose-600 shadow-lg shadow-rose-600/20' : 'text-slate-400 hover:bg-white/5'}`}>
            <Bell /> <span className="hidden md:inline">Notificações</span>
          </button>
          
          <p className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-6">Design do Site</p>
          <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'hero' ? 'bg-sky-600 shadow-lg shadow-sky-600/20' : 'text-slate-400 hover:bg-white/5'}`}>
            <Layout /> <span className="hidden md:inline">Banner Inicial</span>
          </button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'about' ? 'bg-sky-600' : 'text-slate-400 hover:bg-white/5'}`}>
            <Info /> <span className="hidden md:inline">Sobre & Fundadores</span>
          </button>
          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'contact' ? 'bg-sky-600' : 'text-slate-400 hover:bg-white/5'}`}>
            <Phone /> <span className="hidden md:inline">Contactos & Social</span>
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'projects' ? 'bg-sky-600' : 'text-slate-400 hover:bg-white/5'}`}>
            <Briefcase /> <span className="hidden md:inline">Projetos</span>
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition">
            <LogOut /> <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-4 md:p-12 no-scrollbar bg-slate-50">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'blog' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Publicações</h1>
                <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition"><Plus /> Novo Post</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex gap-6 items-center shadow-sm group">
                    <img src={post.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{post.title}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-black">{post.category}</p>
                    </div>
                    <button onClick={() => post.id && postService.deletePost(post.id).then(fetchData)} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl opacity-0 group-hover:opacity-100 transition"><Trash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {siteConfig && activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Alerta Global para Visitantes</h1>
                <button onClick={handleSaveSite} disabled={submitting} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-600 shadow-xl transition disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save />} Guardar Notificação
                </button>
              </div>

              <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <div>
                     <h3 className="font-black text-slate-800">Ativar Barra de Notificação</h3>
                     <p className="text-xs text-slate-400">Quando ativa, aparecerá no topo de todas as páginas.</p>
                   </div>
                   <button 
                     onClick={() => setSiteConfig({...siteConfig, notification: {...(siteConfig.notification || {} as any), active: !siteConfig.notification?.active}})}
                     className={`w-16 h-8 rounded-full transition-all relative ${siteConfig.notification?.active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                   >
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${siteConfig.notification?.active ? 'left-9' : 'left-1'}`}></div>
                   </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Mensagem do Alerta (Máx 120 caracteres)</label>
                    <input 
                      type="text" 
                      maxLength={120}
                      value={siteConfig.notification?.message || ''} 
                      onChange={e => setSiteConfig({...siteConfig, notification: {...(siteConfig.notification || {} as any), message: e.target.value}})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-bold text-lg" 
                      placeholder="Ex: Inscrições para o novo curso de Março abertas em Benguela!"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Link de Destino (Opcional)</label>
                      <input 
                        type="text" 
                        value={siteConfig.notification?.link || ''} 
                        onChange={e => setSiteConfig({...siteConfig, notification: {...(siteConfig.notification || {} as any), link: e.target.value}})} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-bold" 
                        placeholder="Ex: /blog ou link externo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Tipo de Destaque</label>
                      <div className="flex gap-4">
                        {['success', 'info', 'warning'].map(type => (
                          <button
                            key={type}
                            onClick={() => setSiteConfig({...siteConfig, notification: {...(siteConfig.notification || {} as any), type: type as any}})}
                            className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase border-2 transition ${
                              siteConfig.notification?.type === type 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'bg-white text-slate-400 border-slate-100'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100 flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-600 shrink-0">
                    <CheckCircle2 />
                  </div>
                  <div>
                    <h4 className="font-black text-sky-900 mb-1">Dica de Notificação</h4>
                    <p className="text-xs text-sky-700 leading-relaxed font-medium">Use a barra para urgências. Se for uma notícia longa, coloque um resumo aqui e ligue ao post completo no Blog do Acácias Wela.</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {siteConfig && activeTab !== 'blog' && activeTab !== 'notifications' && (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Editar {activeTab.toUpperCase()}</h1>
                <button onClick={handleSaveSite} disabled={submitting} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-600 shadow-xl transition disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save />} Guardar Alterações
                </button>
              </div>

              {activeTab === 'hero' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Título do Banner</label>
                      <input type="text" value={siteConfig.hero.title} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Frase de Efeito</label>
                      <textarea value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold h-24" />
                    </div>
                    <div className="space-y-2 pt-4">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Imagem de Fundo</label>
                      <div className="flex items-center gap-4">
                        <img src={siteConfig.hero.imageUrl} className="w-24 h-16 rounded-xl object-cover bg-slate-100" />
                        <label className="flex-1 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-dashed border-emerald-200 text-center cursor-pointer font-bold text-xs">
                          Escolher da Galeria do Telemóvel
                          <input type="file" className="hidden" accept="image/*" onChange={async e => {
                            if(e.target.files?.[0]) {
                              const b64 = await handleMediaUpload(e.target.files[0]);
                              setSiteConfig({...siteConfig, hero: {...siteConfig.hero, imageUrl: b64}});
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'about' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">História Completa</label>
                      <textarea value={siteConfig.about.text} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, text: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold h-64" />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Equipa Fundadora</label>
                       <div className="grid grid-cols-1 gap-4">
                          {siteConfig.about.founders.map((f, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                               <div className="relative group w-20 h-20 shrink-0">
                                 <img src={f.imageUrl || `https://ui-avatars.com/api/?name=${f.name}`} className="w-full h-full rounded-full object-cover border-2 border-white shadow-md" />
                                 <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                                    <Camera className="text-white w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                      if(e.target.files?.[0]) {
                                        const b64 = await handleMediaUpload(e.target.files[0], true);
                                        const newF = [...siteConfig.about.founders];
                                        newF[i].imageUrl = b64;
                                        setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                                      }
                                    }} />
                                 </label>
                               </div>
                               <input type="text" value={f.name} onChange={e => {
                                 const newF = [...siteConfig.about.founders];
                                 newF[i].name = e.target.value;
                                 setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                               }} className="bg-white rounded-xl px-4 py-2 font-bold text-sm flex-1" />
                               <input type="text" value={f.role} onChange={e => {
                                 const newF = [...siteConfig.about.founders];
                                 newF[i].role = e.target.value;
                                 setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                               }} className="bg-white rounded-xl px-4 py-2 font-bold text-xs text-emerald-600 flex-1" />
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'contact' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">E-mail</label>
                      <input type="email" value={siteConfig.contact.email} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, email: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">WhatsApp</label>
                      <input type="text" value={siteConfig.contact.phone} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Benguela Localização</label>
                      <input type="text" value={siteConfig.contact.location} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, location: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Facebook</label>
                      <input type="text" value={(siteConfig.contact as any).facebook || ''} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, facebook: e.target.value} as any})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'projects' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-800">Projetos Ativos</h3>
                    <button onClick={() => {
                      const newP: Project = { id: Date.now().toString(), title: 'Novo Projeto', description: '', image: '', impact: 'Ação Social' };
                      setSiteConfig({...siteConfig, projects: [...siteConfig.projects, newP]});
                    }} className="p-3 bg-slate-900 text-white rounded-xl"><Plus /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {siteConfig.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 relative">
                        <button onClick={() => setSiteConfig({...siteConfig, projects: siteConfig.projects.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                           <div className="space-y-4">
                              <input type="text" value={proj.title} onChange={e => {
                                const newP = [...siteConfig.projects];
                                newP[idx].title = e.target.value;
                                setSiteConfig({...siteConfig, projects: newP});
                              }} className="w-full bg-white rounded-xl px-4 py-2 font-bold" />
                              <textarea value={proj.description} onChange={e => {
                                const newP = [...siteConfig.projects];
                                newP[idx].description = e.target.value;
                                setSiteConfig({...siteConfig, projects: newP});
                              }} className="w-full bg-white rounded-xl px-4 py-2 font-medium h-24" />
                           </div>
                           <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                             {proj.image ? <img src={proj.image} className="h-32 w-full object-cover rounded-xl" /> : <ImageIcon className="text-slate-200 w-12 h-12" />}
                             <label className="mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest cursor-pointer">
                               Carregar da Galeria
                               <input type="file" className="hidden" accept="image/*" onChange={async e => {
                                 if(e.target.files?.[0]) {
                                   const b64 = await handleMediaUpload(e.target.files[0], true);
                                   const newP = [...siteConfig.projects];
                                   newP[idx].image = b64;
                                   setSiteConfig({...siteConfig, projects: newP});
                                 }
                               }} />
                             </label>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL NOVO POST */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-full md:max-h-[90vh] md:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
             <header className="p-8 border-b flex justify-between items-center bg-slate-50">
               <h3 className="text-2xl font-black text-slate-900">Novo Post / Multimédia</h3>
               <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border rounded-2xl hover:bg-slate-100 transition"><X /></button>
             </header>
             
             <div className="flex-grow overflow-y-auto p-8 md:p-16 space-y-12 no-scrollbar">
                <input type="text" placeholder="Título do Post" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-4xl md:text-5xl font-black w-full outline-none border-none placeholder:text-slate-200" />
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Categoria</label>
                    <select value={blogData.category} onChange={e => setBlogData({...blogData, category: e.target.value})} className="w-full bg-slate-50 px-8 py-5 rounded-2xl font-bold border-none ring-1 ring-slate-200 outline-none">
                      <option>Impacto Social</option>
                      <option>Cursos Acácias</option>
                      <option>Eventos Multimédia</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Capa do Post</label>
                    <label className="flex items-center justify-center gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 rounded-2xl border border-dashed border-emerald-200 cursor-pointer hover:bg-emerald-100 transition">
                      <Camera /> <span className="font-black text-xs uppercase tracking-widest">{blogImage ? 'Capa Pronta' : 'Abrir Galeria'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
                <div className="space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-200">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><Video className="text-emerald-500" /> Galeria Multimédia</h4>
                    <label className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-3 cursor-pointer hover:bg-emerald-600 transition">
                       <Plus className="w-4 h-4" /> Escolher Fotos/Vídeos
                       <input type="file" className="hidden" accept="image/*,video/*" multiple onChange={e => {
                         if(e.target.files) setBlogGallery([...blogGallery, ...Array.from(e.target.files)]);
                       }} />
                    </label>
                  </div>
                  {blogGallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {blogGallery.map((file, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                          {file.type.startsWith('video/') ? (
                             <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          ) : (
                             <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button onClick={() => setBlogGallery(blogGallery.filter((_, i) => i !== idx))} className="bg-red-500 text-white p-2 rounded-lg transition hover:scale-110"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Texto do Post</label>
                  <div ref={editorRef} contentEditable className="outline-none text-xl leading-relaxed text-slate-600 min-h-[200px] bg-slate-50/50 p-8 rounded-3xl border border-slate-100" />
                </div>
             </div>
             <footer className="p-8 border-t flex justify-end gap-4 bg-slate-50">
                <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 font-black text-slate-400 uppercase text-xs">Descartar</button>
                <button onClick={handleCreatePost} disabled={submitting} className="bg-emerald-600 text-white px-16 py-5 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-4 transition hover:bg-emerald-700">
                  {submitting ? <Loader2 className="animate-spin" /> : 'Publicar'}
                </button>
             </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
