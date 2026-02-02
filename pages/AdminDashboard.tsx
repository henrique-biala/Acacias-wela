
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, Layout, Info, Phone, Bell, Send, Zap, Image as ImageIcon, PlusCircle, Landmark, Quote, Facebook
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
  
  // Blog State
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
      const [allPosts, config, subSnap] = await Promise.all([
        postService.getAllPosts(),
        siteService.getConfig(),
        getDocs(collection(db, 'subscribers'))
      ]);
      setPosts(allPosts);
      setFollowerCount(subSnap.size);
      
      // Garante que o objeto siteConfig esteja completo mesmo se vier parcial do Firebase
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
      alert('Configurações guardadas com sucesso!');
    } catch (e) { 
      alert('Erro ao guardar configurações. Tenta novamente.'); 
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
    <div className="h-screen flex items-center justify-center bg-slate-900 flex-col gap-4">
      <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">A carregar Painel...</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Otimizada */}
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5 flex flex-col md:items-start items-center">
           <img src={LOGO_URL} className="w-10 h-10 mb-4 bg-white p-1 rounded-lg" alt="Logo" />
           <div className="hidden md:block">
              <h2 className="text-emerald-400 font-black text-lg tracking-tight">PAINEL WELA</h2>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Controlo de Impacto</p>
           </div>
        </div>
        
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'blog', icon: FileText, label: 'Notícias & Blog' },
            { id: 'hero', icon: Layout, label: 'Ecrã Principal' },
            { id: 'about', icon: Info, label: 'Sobre o Projeto' },
            { id: 'projects', icon: Briefcase, label: 'Cursos & Ações' },
            { id: 'testimonials', icon: Quote, label: 'Depoimentos' },
            { id: 'help', icon: Landmark, label: 'Gestão de Apoio' },
            { id: 'contact', icon: Phone, label: 'Informação Contacto' },
            { id: 'notifications', icon: Bell, label: 'Alertas Instantâneos' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-emerald-600 shadow-xl shadow-emerald-900/20 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <tab.icon size={20} /> <span className="hidden md:inline text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center justify-center md:justify-start gap-4 p-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl font-bold transition">
            <LogOut size={20} /> <span className="hidden md:inline text-sm">Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo do Admin */}
      <main className="flex-grow overflow-y-auto p-6 md:p-12 bg-slate-50 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* ECRÃ PRINCIPAL (HERO) */}
          {activeTab === 'hero' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-end">
                  <div>
                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ecrã Principal</h1>
                     <p className="text-slate-400 font-medium">Edita o banner de boas-vindas do site.</p>
                  </div>
                  <button onClick={handleSaveConfig} disabled={submitting} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Guardar
                  </button>
               </div>
               <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Título Grande</label>
                    <input value={siteConfig.hero.title} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, title: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-black text-xl border-none outline-none focus:ring-2 ring-emerald-500/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Subtítulo Informativo</label>
                    <textarea rows={3} value={siteConfig.hero.subtitle} onChange={e => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, subtitle: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium border-none outline-none focus:ring-2 ring-emerald-500/20" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Imagem de Capa (URL ou Upload)</label>
                    <div className="relative group rounded-[2rem] overflow-hidden border-2 border-slate-100 shadow-inner h-64 bg-slate-200">
                       <img src={siteConfig.hero.imageUrl || 'https://via.placeholder.com/800x400'} className="w-full h-full object-cover" alt="Hero Preview" />
                       <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white cursor-pointer font-black text-sm">
                          <Camera className="w-10 h-10 mb-2" /> Alterar Foto
                          <input type="file" className="hidden" accept="image/*" onChange={async e => {
                            const file = e.target.files?.[0];
                            if(file) {
                               const url = await handleMediaUpload(file);
                               setSiteConfig({...siteConfig, hero: {...siteConfig.hero, imageUrl: url}});
                            }
                          }} />
                       </label>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* GESTÃO DE APOIO (HELP) */}
          {activeTab === 'help' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-end">
                  <div>
                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestão de Apoio</h1>
                     <p className="text-slate-400 font-medium">Informação para doações e voluntariado.</p>
                  </div>
                  <button onClick={handleSaveConfig} disabled={submitting} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Guardar
                  </button>
               </div>
               <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Banco</label>
                       <input value={siteConfig.help.bankName} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, bankName: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold border-none outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Titular da Conta</label>
                       <input value={siteConfig.help.accountHolder} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, accountHolder: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold border-none outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">IBAN de Angola</label>
                     <input value={siteConfig.help.iban} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, iban: e.target.value}})} className="w-full bg-emerald-50 px-6 py-4 rounded-2xl font-black text-emerald-700 border-none outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Chamada para Voluntários</label>
                     <textarea rows={4} value={siteConfig.help.volunteerText} onChange={e => setSiteConfig({...siteConfig, help: {...siteConfig.help, volunteerText: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium border-none outline-none" />
                  </div>
               </div>
            </div>
          )}

          {/* DEPOIMENTOS (TESTIMONIALS) */}
          {activeTab === 'testimonials' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Depoimentos</h1>
                    <p className="text-slate-400 font-medium">Mostra o impacto real na vida dos jovens.</p>
                  </div>
                  <button onClick={() => setSiteConfig({...siteConfig, testimonials: [...siteConfig.testimonials, { id: Date.now().toString(), name: '', role: '', text: '' }]})} className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg">
                    <Plus size={20} /> Adicionar Novo
                  </button>
               </div>
               <div className="space-y-6">
                  {siteConfig.testimonials.map((t, i) => (
                    <div key={t.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-left-4 duration-300">
                       <div className="flex gap-4">
                          <input placeholder="Nome Completo" value={t.name} onChange={e => {
                            const newT = [...siteConfig.testimonials];
                            newT[i].name = e.target.value;
                            setSiteConfig({...siteConfig, testimonials: newT});
                          }} className="flex-1 bg-slate-50 px-6 py-3 rounded-xl font-bold border-none outline-none" />
                          <input placeholder="Cargo/Papel" value={t.role} onChange={e => {
                            const newT = [...siteConfig.testimonials];
                            newT[i].role = e.target.value;
                            setSiteConfig({...siteConfig, testimonials: newT});
                          }} className="w-1/3 bg-slate-50 px-6 py-3 rounded-xl font-black text-[10px] uppercase text-emerald-600 border-none outline-none" />
                          <button onClick={() => setSiteConfig({...siteConfig, testimonials: siteConfig.testimonials.filter(item => item.id !== t.id)})} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition"><Trash2 /></button>
                       </div>
                       <textarea placeholder="Partilha aqui o testemunho..." rows={3} value={t.text} onChange={e => {
                         const newT = [...siteConfig.testimonials];
                         newT[i].text = e.target.value;
                         setSiteConfig({...siteConfig, testimonials: newT});
                       }} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-medium italic border-none outline-none" />
                    </div>
                  ))}
                  {siteConfig.testimonials.length > 0 && (
                    <button onClick={handleSaveConfig} disabled={submitting} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl">
                      {submitting ? <Loader2 className="animate-spin" /> : <Save />} Guardar Todos os Depoimentos
                    </button>
                  )}
               </div>
            </div>
          )}

          {/* CONTACTOS (CONTACT) */}
          {activeTab === 'contact' && siteConfig && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex justify-between items-end">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Informação Contacto</h1>
                  <button onClick={handleSaveConfig} disabled={submitting} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg">
                    {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />} Guardar
                  </button>
               </div>
               <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">WhatsApp / Telemóvel</label>
                    <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 gap-3">
                       <Phone className="text-emerald-500" size={18} />
                       <input value={siteConfig.contact.phone} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value}})} className="w-full bg-transparent font-bold outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail Oficial</label>
                    <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 gap-3">
                       <Globe className="text-sky-500" size={18} />
                       <input value={siteConfig.contact.email} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, email: e.target.value}})} className="w-full bg-transparent font-bold outline-none" />
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Morada Sede (Benguela)</label>
                    <input value={siteConfig.contact.location} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, location: e.target.value}})} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold border-none outline-none" />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Link Facebook</label>
                    <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 gap-3">
                       <Facebook className="text-blue-600" size={18} />
                       <input value={siteConfig.contact.facebook} onChange={e => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, facebook: e.target.value}})} className="w-full bg-transparent font-bold outline-none" placeholder="https://facebook.com/acaciaswela" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* BLOG & NOTÍCIAS (MANTIDO) */}
          {activeTab === 'blog' && (
             <div className="animate-in fade-in duration-500 space-y-12">
                <div className="flex justify-between items-center">
                   <div>
                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">Blog & Notícias</h1>
                     <p className="text-slate-400 font-medium">Gere as publicações que aparecem no site.</p>
                   </div>
                   <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition flex items-center gap-3">
                     <Plus /> Novo Artigo
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {posts.length > 0 ? posts.map(p => (
                     <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex items-center gap-6 group hover:shadow-lg transition duration-500">
                        <img src={p.imageUrl} className="w-20 h-20 rounded-2xl object-cover border border-slate-100" />
                        <div className="flex-1 min-w-0">
                           <h3 className="font-black text-slate-800 truncate text-lg">{p.title}</h3>
                           <p className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">{p.category}</p>
                        </div>
                        <button onClick={() => p.id && confirm('Tens a certeza que queres apagar?') && postService.deletePost(p.id).then(fetchData)} className="p-4 text-rose-400 hover:bg-rose-50 rounded-2xl transition duration-300">
                           <Trash2 size={22} />
                        </button>
                     </div>
                   )) : (
                     <div className="col-span-2 py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                        <FileText className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Ainda não há notícias publicadas.</p>
                     </div>
                   )}
                </div>
             </div>
          )}

        </div>
      </main>
      
      {/* Editor Modal Blog - Consistente */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl z-[500] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[4rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
             <header className="px-10 py-8 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900">Nova Publicação</h3>
                <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition shadow-sm"><X /></button>
             </header>
             <div className="flex-grow overflow-y-auto p-12 space-y-10 no-scrollbar">
                <input placeholder="Título do Artigo" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-5xl font-black w-full outline-none placeholder:text-slate-100 text-slate-900" />
                
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Capa Multimédia</label>
                   <label className="flex flex-col items-center justify-center p-16 border-4 border-dashed border-slate-100 rounded-[3rem] cursor-pointer hover:bg-slate-50 group transition-all">
                      <Camera className="w-16 h-16 text-slate-100 group-hover:text-emerald-500 mb-4 transition" />
                      <span className="font-black text-sm text-slate-400 uppercase tracking-widest">{blogImage ? blogImage.name : 'Selecionar Foto/Vídeo do Dispositivo'}</span>
                      <input type="file" className="hidden" accept="image/*,video/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                   </label>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Conteúdo do Artigo</label>
                   <div ref={editorRef} contentEditable className="min-h-[400px] outline-none text-xl leading-relaxed text-slate-600 bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100" />
                </div>
             </div>
             <footer className="p-10 border-t flex justify-end gap-6 bg-slate-50 shrink-0">
                <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 font-black text-slate-400 hover:text-slate-600">Cancelar</button>
                <button onClick={() => {
                   const content = editorRef.current?.innerHTML || '';
                   if (!blogImage || !blogData.title) return alert('Título e capa são obrigatórios.');
                   setSubmitting(true);
                   postService.createPost({...blogData, content, imageUrl: ''}, blogImage, []).then(() => {
                      setIsEditorOpen(false);
                      fetchData();
                   }).finally(() => setSubmitting(false));
                }} disabled={submitting} className="bg-emerald-600 text-white px-20 py-5 rounded-2xl font-black shadow-2xl transition hover:bg-emerald-700">
                   {submitting ? <Loader2 className="animate-spin" /> : <Send />} Publicar Agora
                </button>
             </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
