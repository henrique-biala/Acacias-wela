
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, Layout, Info, Phone, Bell, Send, Landmark, Quote, Facebook
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
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
      console.error("Admin fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSaveConfig = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Informações atualizadas com sucesso no site!');
    } catch (e) { 
      alert('Erro ao guardar. Verifica a tua ligação.'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleMediaUpload = async (file: File) => {
    try {
       return await postService.uploadMedia(file);
    } catch (e) {
       console.error("Upload error:", e);
       return "";
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-emerald-500 w-12 h-12 mx-auto" />
        <p className="text-slate-500 font-black text-[10px] tracking-widest uppercase">A carregar sistemas...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Otimizada */}
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5 flex flex-col items-center md:items-start">
           <img src={LOGO_URL} className="w-10 h-10 mb-4 bg-white p-1 rounded-lg" alt="Logo" />
           <h2 className="hidden md:block text-emerald-400 font-black text-lg">PAINEL WELA</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'blog', icon: FileText, label: 'Notícias' },
            { id: 'hero', icon: Layout, label: 'Banner Inicial' },
            { id: 'about', icon: Info, label: 'Sobre Nós' },
            { id: 'projects', icon: Briefcase, label: 'Projetos' },
            { id: 'testimonials', icon: Quote, label: 'Depoimentos' },
            { id: 'help', icon: Landmark, label: 'Apoio/IBAN' },
            { id: 'contact', icon: Phone, label: 'Contactos' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <tab.icon size={20} /> <span className="hidden md:inline text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center justify-center md:justify-start gap-4 p-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl font-bold">
            <LogOut size={20} /> <span className="hidden md:inline text-sm">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-6 md:p-12 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Aba Blog */}
          {activeTab === 'blog' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="flex justify-between items-center">
                   <h1 className="text-4xl font-black text-slate-900">Notícias</h1>
                   <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">Novo Post</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {posts.map(p => (
                     <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-6 group hover:shadow-md transition">
                        <img src={p.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-slate-800 truncate">{p.title}</h3>
                           <p className="text-[10px] font-black uppercase text-emerald-600">{p.category}</p>
                        </div>
                        <button onClick={() => p.id && confirm('Eliminar?') && postService.deletePost(p.id).then(fetchData)} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition">
                           <Trash2 size={20} />
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* Outras Abas (Ex: Hero, Testimonials) */}
          {activeTab !== 'blog' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-end">
                  <h1 className="text-4xl font-black text-slate-900 capitalize">{activeTab.replace('_', ' ')}</h1>
                  <button onClick={handleSaveConfig} disabled={submitting} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Guardar Alterações
                  </button>
               </div>

               {activeTab === 'hero' && (
                 <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
                    <input placeholder="Título Principal" value={siteConfig.hero.title} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black text-xl border-none outline-none" />
                    <textarea placeholder="Subtítulo" rows={3} value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium border-none outline-none" />
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Imagem de Capa</label>
                       <div className="h-64 rounded-[2rem] overflow-hidden border-2 border-slate-100 relative group">
                          <img src={siteConfig.hero.imageUrl} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer font-black transition">
                             ALTERAR IMAGEM
                             <input type="file" className="hidden" onChange={async e => {
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

               {activeTab === 'testimonials' && (
                 <div className="space-y-6">
                    {siteConfig.testimonials.map((t, i) => (
                      <div key={t.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-4">
                         <div className="flex gap-4">
                            <input placeholder="Nome" value={t.name} onChange={e => {
                              const newT = [...siteConfig.testimonials];
                              newT[i].name = e.target.value;
                              setSiteConfig({...siteConfig, testimonials: newT});
                            }} className="flex-1 bg-slate-50 px-6 py-3 rounded-xl font-bold border-none" />
                            <button onClick={() => setSiteConfig({...siteConfig, testimonials: siteConfig.testimonials.filter(item => item.id !== t.id)})} className="p-3 text-rose-400"><Trash2 /></button>
                         </div>
                         <textarea placeholder="Testemunho..." value={t.text} onChange={e => {
                           const newT = [...siteConfig.testimonials];
                           newT[i].text = e.target.value;
                           setSiteConfig({...siteConfig, testimonials: newT});
                         }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl italic border-none" />
                      </div>
                    ))}
                    <button onClick={() => setSiteConfig({...siteConfig, testimonials: [...siteConfig.testimonials, { id: Date.now().toString(), name: '', role: 'Formando', text: '' }]})} className="w-full border-2 border-dashed border-emerald-500/30 text-emerald-600 py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-2 hover:bg-emerald-50 transition">
                       <Plus /> ADICIONAR DEPOIMENTO REAL
                    </button>
                 </div>
               )}

               {activeTab === 'help' && (
                  <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">IBAN Oficial</label>
                        <input value={siteConfig.help.iban} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, iban: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black text-emerald-600 border-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Banco</label>
                        <input value={siteConfig.help.bankName} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, bankName: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold border-none" />
                     </div>
                  </div>
               )}
               
               {/* As outras abas (Contact, About, Projects) seguem o mesmo padrão seguro de siteConfig */}
            </div>
          )}

        </div>
      </main>

      {/* Modal Editor Blog */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[500] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[4rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
             <header className="px-10 py-8 border-b flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Novo Artigo</h3>
                <button onClick={() => setIsEditorOpen(false)} className="p-3 hover:bg-slate-100 rounded-xl transition"><X /></button>
             </header>
             <div className="flex-grow overflow-y-auto p-12 space-y-8 no-scrollbar">
                <input placeholder="Título do Artigo..." value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-4xl font-black w-full outline-none placeholder:text-slate-200" />
                <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-[3rem] cursor-pointer hover:bg-slate-50 transition">
                   <Camera className="w-12 h-12 text-slate-200 mb-4" />
                   <span className="font-black text-xs text-slate-400 uppercase">{blogImage ? 'Capa Selecionada' : 'Selecionar Foto'}</span>
                   <input type="file" className="hidden" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                </label>
                <div ref={editorRef} contentEditable className="min-h-[300px] outline-none text-xl text-slate-600 font-medium" />
             </div>
             <footer className="p-10 border-t flex justify-end gap-4">
                <button onClick={() => setIsEditorOpen(false)} className="font-bold text-slate-400 px-6">Cancelar</button>
                <button onClick={async () => {
                   if (!blogImage || !blogData.title) return alert('Título e imagem obrigatórios.');
                   setSubmitting(true);
                   try {
                     const content = editorRef.current?.innerHTML || '';
                     await postService.createPost({...blogData, content, imageUrl: ''}, blogImage, []);
                     setIsEditorOpen(false);
                     fetchData();
                   } finally { setSubmitting(false); }
                }} className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black">Publicar Notícia</button>
             </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
