
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { 
  FileText, Plus, LogOut, Trash2, X, Globe, Users, Briefcase, 
  Save, Camera, Loader2, ImageIcon, Layout, Info, Phone, Video, Bell, CheckCircle2, Eye, Send, Heart, Smartphone, Zap, History
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { postService } from '../services/postService';
import { siteService } from '../services/siteService';
import { Post, SiteConfig, Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS, LOGO_URL } from '../constants';

const { useNavigate } = ReactRouterDom;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'notifications'>('blog');
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  const [pushTitle, setPushTitle] = useState('Acácias Wela');
  const [pushBody, setPushBody] = useState('');
  
  const [blogData, setBlogData] = useState({ title: '', category: 'Impacto Social', author: 'Equipe Acácias' });
  const [blogImage, setBlogImage] = useState<File | null>(null);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allPosts, config, subSnap, histSnap] = await Promise.all([
        postService.getAllPosts(),
        siteService.getConfig(),
        getDocs(collection(db, 'subscribers')),
        getDocs(query(collection(db, 'flash_messages'), orderBy('timestamp', 'desc'), limit(5)))
      ]);
      setPosts(allPosts);
      setFollowerCount(subSnap.size);
      setHistory(histSnap.docs.map(d => d.data()));
      setSiteConfig(config);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const sendPushNotification = async () => {
    if (!pushBody) return alert('Escreve a mensagem!');
    setSubmitting(true);
    try {
      // Grava no Firestore - O listener no App.tsx de todos os usuários vai detectar e disparar a notificação nativa
      await addDoc(collection(db, 'flash_messages'), {
        title: pushTitle,
        body: pushBody,
        timestamp: serverTimestamp()
      });
      alert(`SUCESSO!\nA mensagem foi disparada e deve aparecer na barra de notificações de ${followerCount} seguidores em Benguela.`);
      setPushBody('');
      fetchData();
    } catch (e) { alert('Erro no envio.'); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-emerald-500 w-12 h-12" /></div>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-20 md:w-72 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5 font-black text-emerald-400 text-xl hidden md:block">ADMIN WELA</div>
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'blog' ? 'bg-emerald-600' : 'text-slate-400 hover:bg-white/5'}`}><FileText /> <span className="hidden md:inline">Blog</span></button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition ${activeTab === 'notifications' ? 'bg-rose-600 shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}><Bell /> <span className="hidden md:inline">Notificações Push</span></button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition"><LogOut /> <span className="hidden md:inline">Sair</span></button>
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-8 md:p-12 no-scrollbar">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'notifications' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-black text-slate-900">Alerta de Sistema</h1>
                  <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{followerCount} SEGUIDORES ACTIVOS</span>
                  </div>
               </div>

               <section className="bg-slate-900 p-10 md:p-16 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12"><Zap className="w-80 h-80" /></div>
                  <div className="relative z-10 space-y-10">
                    <div className="max-w-xl">
                      <h2 className="text-2xl font-black mb-4">Enviar Notificação Flash</h2>
                      <p className="text-slate-400 text-sm mb-10">Esta mensagem aparecerá na barra de notificações do telemóvel dos seguidores em tempo real.</p>
                      
                      <div className="space-y-6">
                        <input type="text" value={pushTitle} onChange={e => setPushTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition" placeholder="Título" />
                        <textarea rows={4} value={pushBody} onChange={e => setPushBody(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 font-bold text-lg outline-none focus:border-emerald-500 transition" placeholder="Conteúdo do Alerta..." />
                        <button onClick={sendPushNotification} disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-4 transition-all disabled:opacity-50">
                           {submitting ? <Loader2 className="animate-spin" /> : <Send />} Disparar para Todos
                        </button>
                      </div>
                    </div>
                  </div>
               </section>

               <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3"><History className="text-slate-300" /> Histórico de Envios</h3>
                  <div className="space-y-4">
                     {history.map((h, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                           <div>
                              <p className="font-black text-slate-800">{h.title}</p>
                              <p className="text-sm text-slate-500">{h.body}</p>
                           </div>
                           <span className="text-[10px] font-bold text-slate-300 uppercase">{h.timestamp ? new Date(h.timestamp.toMillis()).toLocaleDateString() : 'Agora'}</span>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="animate-in fade-in duration-500">
               <div className="flex justify-between items-center mb-12">
                 <h1 className="text-4xl font-black text-slate-900">Posts</h1>
                 <button onClick={() => setIsEditorOpen(true)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl"><Plus /> Novo Post</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex gap-6 items-center group shadow-sm hover:shadow-md transition">
                    <img src={post.imageUrl} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="flex-1 font-black text-slate-800 truncate">{post.title}</div>
                    <button onClick={() => post.id && postService.deletePost(post.id).then(fetchData)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition"><Trash2 /></button>
                  </div>
                ))}
               </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL EDITOR */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[500] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl">
             <header className="p-10 border-b flex justify-between items-center bg-slate-50">
                <h3 className="text-2xl font-black text-slate-900">Nova Publicação</h3>
                <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-white border rounded-2xl hover:bg-slate-100 transition"><X /></button>
             </header>
             <div className="flex-grow overflow-y-auto p-12 space-y-8 no-scrollbar">
                <input type="text" placeholder="Título do Post" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} className="text-4xl font-black w-full outline-none placeholder:text-slate-200" />
                <label className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-[2.5rem] cursor-pointer hover:bg-slate-50 transition">
                   <Camera className="w-12 h-12 text-slate-200 mb-4" />
                   <span className="font-black text-xs uppercase text-slate-400 tracking-widest">{blogImage ? 'Imagem Pronta' : 'Escolher Imagem de Capa'}</span>
                   <input type="file" className="hidden" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                </label>
                <div ref={editorRef} contentEditable className="min-h-[300px] outline-none text-xl leading-relaxed text-slate-600 bg-slate-50/50 p-8 rounded-3xl" placeholder="Conteúdo do post..." />
             </div>
             <footer className="p-10 border-t flex justify-end gap-6 bg-slate-50">
                <button onClick={() => {
                  const content = editorRef.current?.innerHTML || '';
                  if (!blogImage || !blogData.title) return alert('Título e imagem são obrigatórios.');
                  setSubmitting(true);
                  postService.createPost({...blogData, content, imageUrl: ''}, blogImage, []).then(() => {
                    setIsEditorOpen(false);
                    fetchData();
                  }).finally(() => setSubmitting(false));
                }} disabled={submitting} className="bg-emerald-600 text-white px-16 py-5 rounded-2xl font-black shadow-2xl transition hover:bg-emerald-700">
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
