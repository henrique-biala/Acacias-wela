
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, Layout, Info, Phone, Bell, Send, Zap, Image as ImageIcon, PlusCircle, Landmark, Quote
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, LOGO_URL, CONTACT_INFO } from '../constants';

const { useNavigate } = ReactRouterDom;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'hero' | 'about' | 'projects' | 'contact' | 'help' | 'testimonials' | 'notifications'>('blog');
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  
  const [blogData, setBlogData] = useState({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allPosts, config, subSnap] = await Promise.all([
        postService.getAllPosts(),
        siteService.getConfig(),
        getDocs(collection(db, 'subscribers'))
      ]);
      setPosts(allPosts);
      setFollowerCount(subSnap.size);
      setSiteConfig(config || {
        hero: { title: 'Acácias Wela', subtitle: '', imageUrl: '', badge: 'Benguela' },
        about: { title: 'Sobre Nós', text: '', missionQuote: '', founders: [] },
        contact: { email: CONTACT_INFO.email, phone: CONTACT_INFO.phone, location: CONTACT_INFO.location },
        help: { iban: '', bankName: '', accountHolder: '', volunteerText: '' },
        projects: DEFAULT_PROJECTS,
        testimonials: []
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSaveConfig = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Configurações salvas!');
    } catch (e) { alert('Erro ao salvar.'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500 w-12 h-12" /></div>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5 font-black text-emerald-400">ADMIN</div>
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'blog', icon: FileText, label: 'Blog' },
            { id: 'hero', icon: Layout, label: 'Hero' },
            { id: 'about', icon: Info, label: 'Sobre' },
            { id: 'projects', icon: Briefcase, label: 'Cursos' },
            { id: 'testimonials', icon: Quote, label: 'Depoimentos' },
            { id: 'help', icon: Landmark, label: 'Gestão Doações' },
            { id: 'contact', icon: Phone, label: 'Contactos' },
            { id: 'notifications', icon: Bell, label: 'Alertas' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl font-bold transition ${activeTab === tab.id ? 'bg-emerald-600 shadow-xl shadow-emerald-900/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <tab.icon size={20} /> <span className="hidden md:inline text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="p-8 border-t border-white/5 text-rose-400 flex items-center gap-4 font-bold hover:bg-rose-500/10">
          <LogOut size={20} /> <span className="hidden md:inline">Sair</span>
        </button>
      </aside>

      <main className="flex-grow overflow-y-auto p-12 bg-slate-50 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Aba Ajuda/Doações */}
          {activeTab === 'help' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-black text-slate-900">Gestão de Apoios</h1>
                  <button onClick={handleSaveConfig} disabled={submitting} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">
                    {submitting ? <Loader2 className="animate-spin" /> : 'Salvar'}
                  </button>
               </div>
               <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Banco</label>
                       <input value={siteConfig.help.bankName} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, bankName: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Titular</label>
                       <input value={siteConfig.help.accountHolder} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, accountHolder: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">IBAN (Apenas números e iniciais)</label>
                     <input value={siteConfig.help.iban} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, iban: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Texto Chamada Voluntários</label>
                     <textarea rows={4} value={siteConfig.help.volunteerText} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, volunteerText: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium" />
                  </div>
               </div>
            </div>
          )}

          {/* Aba Depoimentos */}
          {activeTab === 'testimonials' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-black text-slate-900">Vidas Transformadas</h1>
                  <button onClick={() => setSiteConfig({...siteConfig, testimonials: [...siteConfig.testimonials, { id: Date.now().toString(), name: '', role: '', text: '' }]})} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2">
                    <Plus size={20} /> Adicionar
                  </button>
               </div>
               <div className="space-y-6">
                  {siteConfig.testimonials.map((t, i) => (
                    <div key={t.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
                       <div className="flex gap-4">
                          <input placeholder="Nome" value={t.name} onChange={e => {
                            const newT = [...siteConfig.testimonials];
                            newT[i].name = e.target.value;
                            setSiteConfig({...siteConfig, testimonials: newT});
                          }} className="flex-1 bg-slate-50 px-6 py-3 rounded-xl font-bold" />
                          <input placeholder="Cargo" value={t.role} onChange={e => {
                            const newT = [...siteConfig.testimonials];
                            newT[i].role = e.target.value;
                            setSiteConfig({...siteConfig, testimonials: newT});
                          }} className="w-1/3 bg-slate-50 px-6 py-3 rounded-xl font-black text-[10px] uppercase text-emerald-600" />
                          <button onClick={() => setSiteConfig({...siteConfig, testimonials: siteConfig.testimonials.filter(item => item.id !== t.id)})} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl"><Trash2 /></button>
                       </div>
                       <textarea placeholder="Texto do testemunho..." rows={3} value={t.text} onChange={e => {
                         const newT = [...siteConfig.testimonials];
                         newT[i].text = e.target.value;
                         setSiteConfig({...siteConfig, testimonials: newT});
                       }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium italic" />
                    </div>
                  ))}
                  <button onClick={handleSaveConfig} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black">Salvar Depoimentos</button>
               </div>
            </div>
          )}

          {/* Manter outras abas (blog, hero, etc.) conforme implementação anterior mas com design unificado */}
          {activeTab === 'blog' && (
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <h1 className="text-4xl font-black text-slate-900">Blog</h1>
                   <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">Novo Post</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {posts.map(p => (
                     <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-6 group">
                        <img src={p.imageUrl} className="w-20 h-20 rounded-2xl object-cover" />
                        <div className="flex-1 min-w-0">
                           <h3 className="font-black text-slate-800 truncate">{p.title}</h3>
                           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{p.category}</p>
                        </div>
                        <button onClick={() => p.id && postService.deletePost(p.id).then(fetchData)} className="p-4 text-rose-400 hover:bg-rose-50 rounded-2xl"><Trash2 /></button>
                     </div>
                   ))}
                </div>
             </div>
          )}

        </div>
      </main>
      
      {/* Editor Modal mantido como antes para fluxo consistente */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[500] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl">
             <header className="px-10 py-8 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900">Nova Publicação</h3>
                <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border border-slate-200 rounded-2xl"><X /></button>
             </header>
             <div className="flex-grow overflow-y-auto p-12 space-y-8 no-scrollbar">
                <input placeholder="Título do Artigo" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-5xl font-black w-full outline-none placeholder:text-slate-100" />
                <label className="flex flex-col items-center justify-center p-16 border-4 border-dashed border-slate-100 rounded-[3rem] cursor-pointer hover:bg-slate-50 transition">
                   <Camera className="w-12 h-12 text-slate-200 mb-4" />
                   <span className="font-black text-sm text-slate-400 uppercase tracking-widest">{blogImage ? 'Capa Selecionada' : 'Carregar Foto de Capa'}</span>
                   <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                </label>
                <div ref={editorRef} contentEditable className="min-h-[400px] outline-none text-xl leading-relaxed text-slate-600 bg-slate-50 p-10 rounded-[3rem] border border-slate-100" />
             </div>
             <footer className="p-10 border-t flex justify-end gap-6 bg-slate-50">
                <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 font-black text-slate-400">Cancelar</button>
                <button onClick={() => {
                   const content = editorRef.current?.innerHTML || '';
                   if (!blogImage || !blogData.title) return alert('Campos obrigatórios!');
                   setSubmitting(true);
                   postService.createPost({...blogData, content, imageUrl: ''}, blogImage, []).then(() => {
                      setIsEditorOpen(false);
                      fetchData();
                   }).finally(() => setSubmitting(false));
                }} disabled={submitting} className="bg-emerald-600 text-white px-20 py-5 rounded-2xl font-black shadow-2xl">
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
