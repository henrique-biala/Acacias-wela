
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, ImageIcon, Layout, Info, Phone, Target
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig, Project, Founder } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, CONTACT_INFO } from '../constants';

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
          badge: 'Benguela • Capacitação Juven' 
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
        contact: CONTACT_INFO,
        projects: DEFAULT_PROJECTS
      };

      setSiteConfig(config || defaultConfig);
    } catch (err) {
      console.warn("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSite = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Alterações no site guardadas com sucesso!');
    } catch (err) {
      alert('Erro ao guardar configurações.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!blogImage || !blogData.title) return alert('Preencha o título e a foto de capa.');
    
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
      {/* Sidebar Expandida */}
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <h2 className="hidden md:block text-xl font-black text-emerald-400">PAINEL WELA</h2>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
          <p className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-4">Gestão</p>
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'blog' ? 'bg-emerald-600 shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:bg-white/5'}`}>
            <FileText /> <span className="hidden md:inline">Blog & Notícias</span>
          </button>
          
          <p className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2 mt-6">Conteúdo do Site</p>
          <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'hero' ? 'bg-sky-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Layout /> <span className="hidden md:inline">Página Inicial (Hero)</span>
          </button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'about' ? 'bg-sky-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Info /> <span className="hidden md:inline">Quem Somos / Sobre</span>
          </button>
          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'contact' ? 'bg-sky-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Phone /> <span className="hidden md:inline">Contactos & Benguela</span>
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'projects' ? 'bg-sky-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Briefcase /> <span className="hidden md:inline">Projetos Ativos</span>
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition">
            <LogOut /> <span className="hidden md:inline">Sair do Painel</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-4 md:p-12 no-scrollbar">
        <div className="max-w-5xl mx-auto">
          {/* Aba de Blog */}
          {activeTab === 'blog' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900">Gerir Blog</h1>
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

          {/* Abas de Configuração de Site */}
          {siteConfig && activeTab !== 'blog' && (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Editar Conteúdo</h1>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Alterações aplicadas instantaneamente após guardar</p>
                </div>
                <button onClick={handleSaveSite} disabled={submitting} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-600 shadow-xl transition disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save />} Guardar Tudo
                </button>
              </div>

              {/* Seção Hero */}
              {activeTab === 'hero' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-xl font-black flex items-center gap-3 text-slate-800"><Layout className="text-emerald-500" /> Cabeçalho da Página Inicial</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Título Principal (Banner)</label>
                      <input type="text" value={siteConfig.hero.title} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Subtítulo / Descrição</label>
                      <textarea value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold h-32" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Etiqueta (Badge)</label>
                        <input type="text" value={siteConfig.hero.badge} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, badge: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">URL da Imagem de Fundo</label>
                        <input type="text" value={siteConfig.hero.imageUrl} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, imageUrl: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Seção Sobre */}
              {activeTab === 'about' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-xl font-black flex items-center gap-3 text-slate-800"><Info className="text-emerald-500" /> Quem Somos / Nossa História</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Título da Seção</label>
                      <input type="text" value={siteConfig.about.title} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Texto da História</label>
                      <textarea value={siteConfig.about.text} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, text: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold h-64" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Frase de Missão (Citação)</label>
                      <input type="text" value={siteConfig.about.missionQuote} onChange={e => setSiteConfig({...siteConfig, about: {...siteConfig.about, missionQuote: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold italic" />
                    </div>
                    
                    <div className="pt-6">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 mb-4 block">Fundadores (Ordem Prioritária)</label>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {siteConfig.about.founders.map((f, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                               <input type="text" value={f.name} onChange={e => {
                                 const newF = [...siteConfig.about.founders];
                                 newF[i].name = e.target.value;
                                 setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                               }} className="w-full bg-white rounded-xl px-4 py-2 mb-2 font-bold text-xs" placeholder="Nome" />
                               <input type="text" value={f.role} onChange={e => {
                                 const newF = [...siteConfig.about.founders];
                                 newF[i].role = e.target.value;
                                 setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                               }} className="w-full bg-white rounded-xl px-4 py-2 font-bold text-[10px] text-emerald-600" placeholder="Cargo" />
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Seção Contacto */}
              {activeTab === 'contact' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <h3 className="text-xl font-black flex items-center gap-3 text-slate-800"><Phone className="text-emerald-500" /> Contactos & Localização</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">E-mail de Contacto</label>
                      <input type="email" value={siteConfig.contact.email} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, email: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">WhatsApp / Telefone</label>
                      <input type="text" value={siteConfig.contact.phone} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div className="col-span-full space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Localização (Ex: Benguela, Angola)</label>
                      <input type="text" value={siteConfig.contact.location} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, location: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                  </div>
                </section>
              )}

              {/* Seção Projetos */}
              {activeTab === 'projects' && (
                <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black flex items-center gap-3 text-slate-800"><Briefcase className="text-emerald-500" /> Projetos em Destaque</h3>
                    <button onClick={() => {
                      const newProj: Project = { id: Date.now().toString(), title: 'Novo Projeto', description: '', image: '', impact: 'Capacitação' };
                      setSiteConfig({...siteConfig, projects: [...siteConfig.projects, newProj]});
                    }} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-emerald-600 transition"><Plus /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {siteConfig.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 relative">
                        <button onClick={() => {
                          const newProj = siteConfig.projects.filter((_, i) => i !== idx);
                          setSiteConfig({...siteConfig, projects: newProj});
                        }} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" value={proj.title} onChange={e => {
                            const newP = [...siteConfig.projects];
                            newP[idx].title = e.target.value;
                            setSiteConfig({...siteConfig, projects: newP});
                          }} className="bg-white rounded-xl px-4 py-2 font-bold" placeholder="Título do Projeto" />
                          <input type="text" value={proj.impact} onChange={e => {
                            const newP = [...siteConfig.projects];
                            newP[idx].impact = e.target.value;
                            setSiteConfig({...siteConfig, projects: newP});
                          }} className="bg-white rounded-xl px-4 py-2 font-bold text-sky-600" placeholder="Tipo de Impacto" />
                          <textarea value={proj.description} onChange={e => {
                            const newP = [...siteConfig.projects];
                            newP[idx].description = e.target.value;
                            setSiteConfig({...siteConfig, projects: newP});
                          }} className="bg-white rounded-xl px-4 py-2 font-medium col-span-full h-24" placeholder="Descrição" />
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

      {/* MODAL EDITOR DE BLOG */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl h-full md:max-h-[90vh] md:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
             <header className="p-10 border-b flex justify-between items-center bg-slate-50">
               <h3 className="text-2xl font-black text-slate-900">Novo Post no Blog</h3>
               <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border rounded-2xl hover:bg-slate-100 transition"><X /></button>
             </header>
             
             <div className="flex-grow overflow-y-auto p-16 space-y-12 no-scrollbar">
                <input type="text" placeholder="Título chamativo" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-5xl font-black w-full outline-none border-none placeholder:text-slate-200" />
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Categoria</label>
                    <select value={blogData.category} onChange={e => setBlogData({...blogData, category: e.target.value})} className="w-full bg-slate-50 px-8 py-5 rounded-2xl font-bold border-none ring-1 ring-slate-200 outline-none">
                      <option>Impacto Social</option>
                      <option>Cursos Acácias</option>
                      <option>Notícias Benguela</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Imagem de Capa</label>
                    <label className="flex items-center justify-center gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 rounded-2xl border border-dashed border-emerald-200 cursor-pointer">
                      <Camera /> <span className="font-black text-xs uppercase">{blogImage ? 'Ficheiro Selecionado' : 'Carregar Foto'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Conteúdo (HTML Permitido)</label>
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
