
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, UploadCloud, Loader2, Image as LucideImage,
  Tag
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../constants';

const { useNavigate } = ReactRouterDom;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'site' | 'projects'>('blog');
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
  const [blogImage, setBlogImage] = useState<File | null>(null);

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
      setSiteConfig(config || {
        hero: { title: 'Acácias Wela', subtitle: 'Elevando o potencial da juventude', imageUrl: '', badge: 'Capacitação Profissional' },
        about: { 
          title: 'Quem Somos', 
          text: 'O Acácias Wela é um projeto juvenil focado no treinamento profissional e pessoal...', 
          missionQuote: 'Pretendemos continuar a crescer em todas as áreas.',
          founders: [
            { name: 'Ana Binga', role: 'Cofundadora', imageUrl: '' },
            { name: 'Edgar Reinaldo', role: 'Cofundador', imageUrl: '' },
            { name: 'Wandi Ernesto', role: 'Cofundador', imageUrl: '' }
          ]
        },
        contact: { email: 'contato@acaciaswela.org', phone: '+244 9XX XXX XXX', location: 'Luanda, Angola' },
        projects: DEFAULT_PROJECTS
      });
    } catch (err) {
      console.warn("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, fieldId: string, onComplete: (url: string) => void) => {
    setUploadingField(fieldId);
    try {
      // Agora uploadMedia retorna uma string Base64 compactada
      const url = await postService.uploadMedia(file);
      onComplete(url);
    } catch (error) {
      alert("Erro ao processar imagem.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveConfig = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert("Site atualizado!");
    } catch (e) {
      alert("Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
    window.location.reload();
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja apagar este post?')) return;
    try {
      await postService.deletePost(id);
      fetchData();
    } catch (err) {
      alert('Erro ao apagar.');
    }
  };

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!blogImage) return alert('Escolha uma imagem de capa.');
    if (!blogData.title) return alert('Digite um título.');
    
    setSubmitting(true);
    try {
      await postService.createPost({ ...blogData, content, imageUrl: '' }, blogImage);
      setIsEditorOpen(false);
      setBlogImage(null);
      setBlogData({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
      fetchData();
    } catch (err) {
      alert('Erro ao publicar.');
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
      <aside className="w-20 md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-4 md:p-8 border-b border-white/5">
          <h2 className="hidden md:block text-xl font-black text-emerald-400">Painel Wela</h2>
          <div className="md:hidden flex justify-center"><LucideImage className="text-emerald-400" /></div>
        </div>
        <nav className="flex-grow p-2 md:p-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'blog' ? 'bg-emerald-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <FileText className="shrink-0" /> <span className="hidden md:inline">Blog</span>
          </button>
          <button onClick={() => setActiveTab('site')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'site' ? 'bg-sky-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Globe className="shrink-0" /> <span className="hidden md:inline">Configurações</span>
          </button>
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'projects' ? 'bg-amber-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Briefcase className="shrink-0" /> <span className="hidden md:inline">Projetos</span>
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 hover:bg-red-500/10 text-red-400 rounded-2xl font-bold transition">
            <LogOut className="shrink-0" /> <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-4 md:p-12 no-scrollbar">
        <div className="max-w-5xl mx-auto">
          
          {activeTab === 'blog' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog</h1>
                <button onClick={() => setIsEditorOpen(true)} className="w-full md:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-xl transition active:scale-95">
                  <Plus /> Novo Post
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex gap-6 items-center shadow-sm">
                    <img src={post.imageUrl} className="w-20 h-20 rounded-2xl object-cover bg-slate-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{post.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">{post.category}</p>
                    </div>
                    <button onClick={() => post.id && handleDeletePost(post.id)} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition">
                      <Trash2 />
                    </button>
                  </div>
                ))}
                {posts.length === 0 && <p className="text-slate-400 font-bold col-span-2 text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">Nenhum post ainda.</p>}
              </div>
            </div>
          )}

          {activeTab === 'site' && siteConfig && (
            <div className="space-y-12 pb-24 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Site Geral</h1>
                <button onClick={handleSaveConfig} disabled={submitting} className="bg-sky-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-sky-700 shadow-xl disabled:opacity-50 active:scale-95">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save />} Guardar Site
                </button>
              </div>

              <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-xl font-black flex items-center gap-3"><LucideImage className="text-sky-500" /> Hero Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="relative aspect-video rounded-[2rem] bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200 group">
                    {siteConfig.hero.imageUrl ? (
                      <img src={siteConfig.hero.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center"><Camera className="text-slate-300 w-12 h-12" /></div>
                    )}
                    <label className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'hero', (url) => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, imageUrl: url}}))} />
                      <div className="bg-white p-4 rounded-full text-slate-900 shadow-2xl">
                        {uploadingField === 'hero' ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                      </div>
                    </label>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <input type="text" value={siteConfig.hero.title} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none" placeholder="Título" />
                    <textarea rows={4} value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-medium outline-none" placeholder="Subtítulo" />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                <h3 className="text-xl font-black flex items-center gap-3"><Users className="text-emerald-500" /> Fundadores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {siteConfig.about.founders.map((founder, idx) => (
                    <div key={idx} className="flex flex-col items-center p-8 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6">
                      <div className="relative w-40 h-40 group">
                        <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-200">
                          {founder.imageUrl ? <img src={founder.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-4xl text-slate-400">{founder.name[0]}</div>}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-4 rounded-2xl cursor-pointer shadow-2xl hover:scale-110 transition active:scale-95">
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], `founder-${idx}`, (url) => {
                             const newF = [...siteConfig.about.founders];
                             newF[idx].imageUrl = url;
                             setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                           })} />
                           {uploadingField === `founder-${idx}` ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                        </label>
                      </div>
                      <div className="w-full space-y-2">
                        <input type="text" value={founder.name} onChange={e => {
                          const newF = [...siteConfig.about.founders];
                          newF[idx].name = e.target.value;
                          setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                        }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-center font-bold text-sm" placeholder="Nome" />
                        <input type="text" value={founder.role} onChange={e => {
                          const newF = [...siteConfig.about.founders];
                          newF[idx].role = e.target.value;
                          setSiteConfig({...siteConfig, about: {...siteConfig.about, founders: newF}});
                        }} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-400" placeholder="Cargo" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'projects' && siteConfig && (
            <div className="space-y-12 pb-24 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Projetos</h1>
                <div className="flex w-full md:w-auto gap-4">
                  <button onClick={handleSaveConfig} className="flex-1 md:flex-none bg-amber-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition active:scale-95"><Save /> Guardar</button>
                  <button onClick={() => setSiteConfig({...siteConfig, projects: [...siteConfig.projects, { id: Date.now().toString(), title: 'Novo Projeto', description: '', image: '', impact: 'Social' }]})} className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2"><Plus /> Novo</button>
                </div>
              </div>

              <div className="space-y-8">
                {siteConfig.projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 group">
                    <div className="w-full md:w-64 aspect-square bg-slate-50 rounded-[3rem] overflow-hidden relative border border-slate-100 shrink-0">
                      {proj.image ? <img src={proj.image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-200"><Briefcase className="w-16 h-16" /></div>}
                      <label className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], `proj-${idx}`, (url) => {
                          const newP = [...siteConfig.projects];
                          newP[idx].image = url;
                          setSiteConfig({...siteConfig, projects: newP});
                        })} />
                        <div className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl">
                           {uploadingField === `proj-${idx}` ? <Loader2 className="animate-spin" /> : <><UploadCloud /> Carregar Foto</>}
                        </div>
                      </label>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={proj.title} onChange={e => {
                          const newP = [...siteConfig.projects];
                          newP[idx].title = e.target.value;
                          setSiteConfig({...siteConfig, projects: newP});
                        }} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" placeholder="Nome" />
                        <input type="text" value={proj.impact} onChange={e => {
                          const newP = [...siteConfig.projects];
                          newP[idx].impact = e.target.value;
                          setSiteConfig({...siteConfig, projects: newP});
                        }} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" placeholder="Impacto" />
                      </div>
                      <textarea rows={5} value={proj.description} onChange={e => {
                        const newP = [...siteConfig.projects];
                        newP[idx].description = e.target.value;
                        setSiteConfig({...siteConfig, projects: newP});
                      }} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-medium text-slate-600 leading-relaxed" placeholder="Descrição..." />
                    </div>
                    <button onClick={() => setSiteConfig({...siteConfig, projects: siteConfig.projects.filter((_, i) => i !== idx)})} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl self-start transition"><Trash2 className="w-8 h-8" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-full md:max-h-[90vh] md:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
             <header className="p-6 md:p-10 border-b flex justify-between items-center bg-slate-50">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Novo Post</h3>
               <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border rounded-2xl hover:bg-slate-100 transition"><X /></button>
             </header>
             <div className="flex-grow overflow-y-auto p-6 md:p-16 space-y-10 no-scrollbar">
                <input type="text" placeholder="Título do Post" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-3xl md:text-5xl font-black w-full outline-none border-none placeholder:text-slate-200" />
                <div className="flex flex-col md:flex-row gap-6">
                  <select value={blogData.category} onChange={e => setBlogData({...blogData, category: e.target.value})} className="bg-slate-50 px-8 py-5 rounded-[1.5rem] font-bold border-none ring-1 ring-slate-200 outline-none">
                    <option>Impacto Social</option>
                    <option>Cursos Acácias</option>
                    <option>Notícias</option>
                  </select>
                  <label className="flex-grow flex items-center justify-center gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 rounded-[1.5rem] border border-dashed border-emerald-200 cursor-pointer active:bg-emerald-100">
                    <Camera className="w-6 h-6" />
                    <span className="text-sm font-black uppercase tracking-widest">{blogImage ? blogImage.name : 'Escolher Foto de Capa'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div ref={editorRef} contentEditable className="outline-none text-xl leading-relaxed text-slate-600 min-h-[400px]" />
             </div>
             <footer className="p-6 md:p-10 border-t flex flex-col md:flex-row justify-end gap-4 md:gap-8 bg-slate-50">
                <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 font-black text-slate-400 uppercase tracking-widest text-xs">Descartar</button>
                <button onClick={handleCreatePost} disabled={submitting} className="bg-emerald-600 text-white px-16 py-5 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-4 hover:scale-105 transition active:scale-95">
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
