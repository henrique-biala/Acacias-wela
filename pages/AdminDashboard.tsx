
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, UploadCloud, Loader2, Image as LucideImage,
  ImageIcon, LayoutGrid
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, CONTACT_INFO } from '../constants';

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
      setSiteConfig(config || {
        hero: { title: 'Acácias Wela', subtitle: 'Elevando o potencial da juventude', imageUrl: '', badge: 'Capacitação Profissional' },
        about: { 
          title: 'Quem Somos', 
          text: '', 
          missionQuote: '', 
          founders: [
            { name: 'Emília Wandessa', role: 'Cofundadora' },
            { name: 'Ana Binga', role: 'Cofundadora' },
            { name: 'Edgar Reinaldo', role: 'Cofundador' }
          ] 
        },
        contact: CONTACT_INFO,
        projects: DEFAULT_PROJECTS
      });
    } catch (err) {
      console.warn("Erro ao carregar.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, fieldId: string, onComplete: (url: string) => void) => {
    setUploadingField(fieldId);
    try {
      const url = await postService.uploadMedia(file, false);
      onComplete(url);
    } catch (error) {
      alert("Erro ao processar imagem.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!blogImage) return alert('Escolha a foto principal.');
    if (!blogData.title) return alert('Digite um título.');
    
    setSubmitting(true);
    try {
      await postService.createPost({ ...blogData, content, imageUrl: '' }, blogImage, blogGallery);
      setIsEditorOpen(false);
      setBlogImage(null);
      setBlogGallery([]);
      setBlogData({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
      fetchData();
    } catch (err) {
      alert('Erro ao publicar. Verifique se as imagens não são muito pesadas.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Configurações guardadas com sucesso!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao guardar as configurações.');
    } finally {
      setSubmitting(false);
    }
  };

  const addImagesToGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (blogGallery.length + files.length > 8) {
        alert("Máximo de 8 fotos na galeria para manter o site gratuito e rápido.");
        return;
      }
      setBlogGallery([...blogGallery, ...files]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setBlogGallery(blogGallery.filter((_, i) => i !== index));
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5"><h2 className="hidden md:block text-xl font-black text-emerald-400">Painel Wela</h2></div>
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'blog' ? 'bg-emerald-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <FileText /> <span className="hidden md:inline">Blog</span>
          </button>
          <button onClick={() => setActiveTab('site')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'site' ? 'bg-sky-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Globe /> <span className="hidden md:inline">Configurar</span>
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition"><LogOut /> <span className="hidden md:inline">Sair</span></button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-4 md:p-12 no-scrollbar">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'blog' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900">Gerir Blog</h1>
                <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl hover:scale-105 transition"><Plus /> Novo Post</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex gap-6 items-center shadow-sm group">
                    <div className="relative">
                       <img src={post.imageUrl} className="w-20 h-20 rounded-2xl object-cover bg-slate-100" />
                       {post.gallery && post.gallery.length > 0 && (
                         <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">+{post.gallery.length}</div>
                       )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{post.title}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{post.category}</p>
                    </div>
                    <button onClick={() => post.id && postService.deletePost(post.id).then(fetchData)} className="p-4 text-red-400 hover:bg-red-50 rounded-2xl transition opacity-0 group-hover:opacity-100"><Trash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'site' && siteConfig && (
            <div className="space-y-12 pb-24 animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Conteúdo do Site</h1>
                <button onClick={handleSaveConfig} disabled={submitting} className="bg-sky-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-sky-700 shadow-xl disabled:opacity-50 transition">
                  {submitting ? <Loader2 className="animate-spin" /> : <Save />} Guardar Site
                </button>
              </div>
              <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                <h3 className="text-xl font-black flex items-center gap-3 text-slate-800">Contactos Atuais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">WhatsApp / Telefone</label>
                      <input type="text" value={siteConfig.contact.phone} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Localização (Cidade)</label>
                      <input type="text" value={siteConfig.contact.location} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, location: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold" />
                   </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* EDITOR DE BLOG MANTIDO COM GALERIA */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-full md:max-h-[90vh] md:rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
             <header className="p-6 md:p-10 border-b flex justify-between items-center bg-slate-50">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Novo Post</h3>
               <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border rounded-2xl hover:bg-slate-100 transition"><X /></button>
             </header>
             
             <div className="flex-grow overflow-y-auto p-6 md:p-16 space-y-12 no-scrollbar">
                <input type="text" placeholder="Título do Post" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-3xl md:text-5xl font-black w-full outline-none border-none placeholder:text-slate-200" />
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Categoria</label>
                    <select value={blogData.category} onChange={e => setBlogData({...blogData, category: e.target.value})} className="w-full bg-slate-50 px-8 py-5 rounded-2xl font-bold border-none ring-1 ring-slate-200 outline-none">
                      <option>Impacto Social</option>
                      <option>Cursos Acácias</option>
                      <option>Notícias</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Foto Principal</label>
                    <label className="flex items-center justify-center gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 rounded-2xl border border-dashed border-emerald-200 cursor-pointer transition">
                      <Camera /> <span className="font-black text-xs uppercase tracking-widest">{blogImage ? blogImage.name : 'Escolher Capa'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Conteúdo</label>
                  <div ref={editorRef} contentEditable className="outline-none text-xl leading-relaxed text-slate-600 min-h-[300px] bg-slate-50/50 p-8 rounded-3xl border border-slate-100" />
                </div>

                <div className="space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-black text-slate-900 flex items-center gap-3"><ImageIcon className="text-emerald-500" /> Galeria Extra</h4>
                    <label className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-emerald-600 transition">
                       <Plus className="w-4 h-4" /> Adicionar
                       <input type="file" className="hidden" accept="image/*" multiple onChange={addImagesToGallery} />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {blogGallery.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                        <button onClick={() => removeGalleryImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg shadow-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>

             <footer className="p-6 md:p-10 border-t flex flex-col md:flex-row justify-end gap-4 bg-slate-50">
                <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 font-black text-slate-400 uppercase tracking-widest text-xs">Descartar</button>
                <button onClick={handleCreatePost} disabled={submitting} className="bg-emerald-600 text-white px-16 py-5 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-4 transition">
                  {submitting ? <Loader2 className="animate-spin" /> : 'Publicar Post'}
                </button>
             </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
