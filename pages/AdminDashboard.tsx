
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, ImageIcon, Layout, Info, Phone, Facebook
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig, Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, CONTACT_INFO, SOCIAL_LINKS } from '../constants';

const { useNavigate } = ReactRouterDom;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'hero' | 'about' | 'contact' | 'projects'>('blog');
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
          facebook: SOCIAL_LINKS.facebook // Adicionado para edição total
        } as any,
        projects: DEFAULT_PROJECTS
      };

      setSiteConfig(config || defaultConfig);
    } catch (err) {
      console.warn("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (file: File, isGallery: boolean = false) => {
    return await postService.uploadMedia(file, isGallery);
  };

  const handleSaveSite = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Tudo pronto! O site foi atualizado com sucesso.');
    } catch (err) {
      alert('Erro ao guardar configurações no banco de dados.');
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
      alert('Erro ao publicar post. Verifique o tamanho das imagens.');
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
      {/* Sidebar de Gestão Total */}
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <h2 className="hidden md:block text-xl font-black text-emerald-400">ADMIN WELA</h2>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
          <p className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-4">Notícias</p>
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'blog' ? 'bg-emerald-600' : 'text-slate-400 hover:bg-white/5'}`}>
            <FileText /> <span className="hidden md:inline">Blog & Eventos</span>
          </button>
          
          <p className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-6">Design do Site</p>
          <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'hero' ? 'bg-sky-600' : 'text-slate-400 hover:bg-white/5'}`}>
            <Layout /> <span className="hidden md:inline">Página Inicial</span>
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
          {/* ABA BLOG */}
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

          {/* ABAS DE CONTEÚDO EDITÁVEL */}
          {siteConfig && activeTab !== 'blog' && (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Editar {activeTab.toUpperCase()}</h1>
                <button onClick={handleSaveSite} disabled={submitting} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-600 shadow-xl transition disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save />} Guardar Alterações
                </button>
              </div>

              {/* HERO */}
              {activeTab === 'hero' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Título do Banner</label>
                      <input type="text" value={siteConfig.hero.title} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Subtítulo</label>
                      <textarea value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold h-32" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Foto de Fundo</label>
                      <div className="flex items-center gap-4">
                        <img src={siteConfig.hero.imageUrl} className="w-24 h-16 rounded-xl object-cover bg-slate-100" />
                        <label className="flex-1 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-dashed border-emerald-200 text-center cursor-pointer font-bold text-xs">
                          Trocar Foto do Banner
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

              {/* SOBRE */}
              {activeTab === 'about' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">História (Quem Somos)</label>
                      <textarea value={siteConfig.about.text} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, text: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold h-64" />
                    </div>
                    
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Fundadores</label>
                       <div className="grid grid-cols-1 gap-4">
                          {siteConfig.about.founders.map((f, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                               <div className="relative group w-20 h-20">
                                 <img src={f.imageUrl || `https://ui-avatars.com/api/?name=${f.name}`} className="w-full h-full rounded-full object-cover border-2 border-white shadow-md" />
                                 <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                                    <Camera className="text-white w-4 h-4" />
                                    <input type="file" className="hidden" onChange={async e => {
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
                               }} className="bg-white rounded-xl px-4 py-2 font-bold text-sm flex-1" placeholder="Nome" />
                               <input type="text" value={f.role} onChange={e => {
                                 const newF = [...siteConfig.about.founders];
                                 newF[i].role = e.target.value;
                                 setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                               }} className="bg-white rounded-xl px-4 py-2 font-bold text-xs text-emerald-600 flex-1" placeholder="Cargo" />
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </section>
              )}

              {/* CONTACTOS */}
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
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Localização</label>
                      <input type="text" value={siteConfig.contact.location} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, location: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Link Facebook</label>
                      <div className="relative">
                        <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-600" />
                        <input type="text" value={(siteConfig.contact as any).facebook || ''} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, facebook: e.target.value} as any})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold" />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* PROJETOS */}
              {activeTab === 'projects' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-800">Projetos em Benguela</h3>
                    <button onClick={() => {
                      const newP: Project = { id: Date.now().toString(), title: 'Novo Projeto', description: '', image: '', impact: 'Impacto Social' };
                      setSiteConfig({...siteConfig, projects: [...siteConfig.projects, newP]});
                    }} className="p-3 bg-slate-900 text-white rounded-xl"><Plus /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {siteConfig.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 relative group">
                        <button onClick={() => setSiteConfig({...siteConfig, projects: siteConfig.projects.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-4">
                              <input type="text" value={proj.title} onChange={e => {
                                const newP = [...siteConfig.projects];
                                newP[idx].title = e.target.value;
                                setSiteConfig({...siteConfig, projects: newP});
                              }} className="w-full bg-white rounded-xl px-4 py-2 font-bold" placeholder="Título" />
                              <textarea value={proj.description} onChange={e => {
                                const newP = [...siteConfig.projects];
                                newP[idx].description = e.target.value;
                                setSiteConfig({...siteConfig, projects: newP});
                              }} className="w-full bg-white rounded-xl px-4 py-2 font-medium h-24" placeholder="Descrição" />
                           </div>
                           <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                             {proj.image ? <img src={proj.image} className="h-32 w-full object-cover rounded-xl mb-2" /> : <ImageIcon className="text-slate-200 w-12 h-12" />}
                             <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest cursor-pointer">
                               Carregar Foto do Projeto
                               <input type="file" className="hidden" onChange={async e => {
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
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl h-full md:max-h-[90vh] md:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
             <header className="p-10 border-b flex justify-between items-center bg-slate-50">
               <h3 className="text-2xl font-black text-slate-900">Novo Post / Evento</h3>
               <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border rounded-2xl hover:bg-slate-100 transition"><X /></button>
             </header>
             
             <div className="flex-grow overflow-y-auto p-16 space-y-12 no-scrollbar">
                <input type="text" placeholder="Título do Post" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-5xl font-black w-full outline-none border-none placeholder:text-slate-200" />
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Categoria</label>
                    <select value={blogData.category} onChange={e => setBlogData({...blogData, category: e.target.value})} className="w-full bg-slate-50 px-8 py-5 rounded-2xl font-bold border-none ring-1 ring-slate-200 outline-none">
                      <option>Impacto Social</option>
                      <option>Cursos Acácias</option>
                      <option>Benguela Noticias</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Mídia Principal (Foto/Vídeo)</label>
                    <label className="flex items-center justify-center gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 rounded-2xl border border-dashed border-emerald-200 cursor-pointer">
                      <Camera /> <span className="font-black text-xs uppercase">{blogImage ? 'Mídia Pronta' : 'Abrir Galeria do Celular'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>

                <div className="space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><ImageIcon className="text-emerald-500" /> Fotos Extras do Evento</h4>
                    <label className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-emerald-600 transition">
                       <Plus className="w-4 h-4" /> Adicionar da Galeria
                       <input type="file" className="hidden" accept="image/*" multiple onChange={e => {
                         if(e.target.files) setBlogGallery([...blogGallery, ...Array.from(e.target.files)]);
                       }} />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {blogGallery.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                        <button onClick={() => setBlogGallery(blogGallery.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Texto Completo</label>
                  <div ref={editorRef} contentEditable className="outline-none text-xl leading-relaxed text-slate-600 min-h-[300px] bg-slate-50/50 p-8 rounded-3xl border border-slate-100" />
                </div>
             </div>

             <footer className="p-10 border-t flex justify-end gap-4 bg-slate-50">
                <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 font-black text-slate-400 uppercase text-xs">Descartar</button>
                <button onClick={handleCreatePost} disabled={submitting} className="bg-emerald-600 text-white px-16 py-5 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-4 transition">
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
