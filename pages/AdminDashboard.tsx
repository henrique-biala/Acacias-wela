
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, ImageIcon, Layout, Info, Phone, Video, Bell, CheckCircle2, Eye, Send, Heart, Smartphone, Zap
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig, Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, CONTACT_INFO, SOCIAL_LINKS, LOGO_URL } from '../constants';

const { useNavigate } = ReactRouterDom;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'hero' | 'about' | 'contact' | 'projects' | 'notifications'>('blog');
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  
  const [pushTitle, setPushTitle] = useState('Acácias Wela');
  const [pushBody, setPushBody] = useState('');
  
  const [blogData, setBlogData] = useState({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [blogGallery, setBlogGallery] = useState<File[]>([]);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allPosts, config, subscribersSnap] = await Promise.all([
        postService.getAllPosts(),
        siteService.getConfig(),
        getDocs(collection(db, 'subscribers'))
      ]);
      setPosts(allPosts);
      setFollowerCount(subscribersSnap.size);
      setSiteConfig(config || {
        hero: { title: 'Acácias Wela', subtitle: 'Capacitação em Benguela', imageUrl: '', badge: 'Benguela' },
        about: { title: 'Sobre', text: '', missionQuote: '', founders: [] },
        contact: { email: '', phone: '', location: '' },
        projects: DEFAULT_PROJECTS,
        notification: { active: false, message: '', type: 'info' }
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const sendPushNotification = async () => {
    if (!pushBody) return alert('Escreve o conteúdo da mensagem!');
    setSubmitting(true);
    try {
      // GRAVA NO FIRESTORE: Isso dispara o alerta em tempo real para TODOS os usuários
      await addDoc(collection(db, 'flash_messages'), {
        title: pushTitle,
        body: pushBody,
        timestamp: serverTimestamp()
      });
      alert(`SUCESSO!\n\nMensagem enviada para ${followerCount} seguidores.\nEles verão o alerta instantaneamente nos seus ecrãs.`);
      setPushBody('');
    } catch (e) {
      alert('Erro ao disparar mensagem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSite = async () => {
    if (!siteConfig) return;
    setSubmitting(true);
    try {
      await siteService.saveConfig(siteConfig);
      alert('Site atualizado!');
    } catch (err) { alert('Erro ao salvar.'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500" /></div>;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5"><h2 className="hidden md:block text-xl font-black text-emerald-400">ADMIN WELA</h2></div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto no-scrollbar">
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'blog' ? 'bg-emerald-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><FileText /> <span className="hidden md:inline">Blog</span></button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'notifications' ? 'bg-rose-600 shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}><Bell /> <span className="hidden md:inline">Notificações</span></button>
          <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'hero' ? 'bg-sky-600' : 'text-slate-400 hover:bg-white/5'}`}><Layout /> <span className="hidden md:inline">Hero</span></button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'about' ? 'bg-sky-600' : 'text-slate-400 hover:bg-white/5'}`}><Info /> <span className="hidden md:inline">Sobre</span></button>
          <button onClick={() => setActiveTab('contact')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'contact' ? 'bg-sky-600' : 'text-slate-400 hover:bg-white/5'}`}><Phone /> <span className="hidden md:inline">Contatos</span></button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition"><LogOut /> <span className="hidden md:inline">Sair</span></button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-4 md:p-12 no-scrollbar bg-slate-50">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-500 space-y-12 pb-20">
               <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Centro de Alertas</h1>
              </div>

              {/* SISTEMA DE DISPARO REAL-TIME */}
              <section className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10"><Zap className="w-64 h-64" /></div>
                <div className="relative z-10 grid lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 p-4 rounded-2xl shadow-xl shadow-emerald-600/20"><Zap className="w-8 h-8" /></div>
                        <div>
                          <h2 className="text-2xl font-black">Disparo Flash</h2>
                          <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">{followerCount} dispositivos prontos</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Título</label>
                          <input type="text" value={pushTitle} onChange={e => setPushTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Mensagem (Real-time)</label>
                          <textarea rows={3} value={pushBody} onChange={e => setPushBody(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 font-bold text-lg outline-none focus:border-emerald-500 transition" placeholder="Escreve a novidade aqui..." />
                        </div>
                        <button onClick={sendPushNotification} disabled={submitting} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-emerald-700 transition shadow-2xl shadow-emerald-900/40 disabled:opacity-50">
                          {submitting ? <Loader2 className="animate-spin" /> : <Send />} Enviar Agora para Benguela
                        </button>
                      </div>
                   </div>
                   <div className="hidden lg:flex flex-col items-center justify-center">
                      <div className="relative w-[280px] h-[500px] bg-black rounded-[3rem] border-[6px] border-slate-800 shadow-2xl p-4">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-b-xl z-20"></div>
                         <div className="mt-16 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                               <img src={LOGO_URL} className="w-4 h-4 rounded" />
                               <span className="text-[8px] font-black uppercase tracking-tighter">{pushTitle}</span>
                            </div>
                            <p className="text-[10px] font-bold leading-tight">{pushBody || 'Escreve a mensagem para veres a pré-visualização...'}</p>
                         </div>
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-6">Simulador em Tempo Real</p>
                   </div>
                </div>
              </section>

              {/* BARRA DO SITE */}
              {siteConfig && (
                <section className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
                  <h2 className="text-xl font-black text-slate-800 mb-6">Barra do Site (Top Banner)</h2>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                    <div>
                      <h3 className="font-bold">Mostrar Banner no Site</h3>
                      <p className="text-[10px] text-slate-400">Ativa ou desativa a barra colorida no topo de todas as páginas.</p>
                    </div>
                    <button onClick={() => setSiteConfig({...siteConfig, notification: {...(siteConfig.notification || {} as any), active: !siteConfig.notification?.active}})} className={`w-14 h-7 rounded-full transition-all relative ${siteConfig.notification?.active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${siteConfig.notification?.active ? 'left-8' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <input type="text" value={siteConfig.notification?.message || ''} onChange={e => setSiteConfig({...siteConfig, notification: {...(siteConfig.notification || {} as any), message: e.target.value}})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-6 py-4 font-bold" placeholder="Mensagem do banner..." />
                    <button onClick={handleSaveSite} disabled={submitting} className="bg-slate-900 text-white rounded-xl font-black">Salvar Banner</button>
                  </div>
                </section>
              )}
            </div>
          )}
          {/* Outras abas permanecem conforme estavam mas simplificadas */}
          {activeTab === 'blog' && (
            <div className="animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-12">
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog</h1>
                 <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2"><Plus /> Novo Post</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex gap-4 items-center group">
                    <img src={post.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 font-bold text-slate-800">{post.title}</div>
                    <button onClick={() => post.id && postService.deletePost(post.id).then(fetchData)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL NOVO POST */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
            <header className="p-8 border-b flex justify-between items-center">
              <h3 className="text-xl font-black">Criar Publicação</h3>
              <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X /></button>
            </header>
            <div className="p-8 overflow-y-auto space-y-6">
              <input type="text" placeholder="Título" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="w-full text-3xl font-black outline-none border-b-2 border-slate-100 focus:border-emerald-500 py-4" />
              <label className="block p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center cursor-pointer hover:border-emerald-400 transition">
                <Camera className="mx-auto mb-2 text-slate-300" />
                <span className="text-xs font-black uppercase text-slate-400">{blogImage ? 'Foto Selecionada' : 'Escolher Foto de Capa'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
              </label>
              <div ref={editorRef} contentEditable className="min-h-[200px] outline-none text-lg p-6 bg-slate-50 rounded-2xl" placeholder="Escreve o conteúdo aqui..." />
            </div>
            <footer className="p-8 border-t bg-slate-50 flex justify-end">
              <button onClick={() => {
                const content = editorRef.current?.innerHTML || '';
                if (!blogImage || !blogData.title) return alert('Título e Foto são obrigatórios.');
                setSubmitting(true);
                postService.createPost({...blogData, content, imageUrl: ''}, blogImage, []).then(() => {
                  setIsEditorOpen(false);
                  fetchData();
                }).finally(() => setSubmitting(false));
              }} className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl">Publicar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
