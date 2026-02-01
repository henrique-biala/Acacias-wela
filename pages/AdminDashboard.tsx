
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  LogOut, 
  Trash2, 
  ImageIcon,
  CheckCircle2,
  X,
  BrainCircuit,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Video,
  Music,
  Settings,
  Eye,
  Undo,
  Redo,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Link as LinkIcon,
  ChevronLeft,
  Send,
  Underline,
  Loader2,
  FileUp
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { postService } from '../services/postService';
import { Post } from '../types';
import { GoogleGenAI } from "@google/genai";

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadType, setCurrentUploadType] = useState<'image' | 'video' | 'audio' | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Impacto Social',
    author: 'Equipe Acácias'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const all = await postService.getAllPosts();
      setPosts(all);
    } catch (err) {
      console.warn("Modo offline ou erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    }
  };

  const triggerUpload = (type: 'image' | 'video' | 'audio') => {
    setCurrentUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'audio/*';
      fileInputRef.current.click();
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadType) return;

    setUploadingMedia(true);
    try {
      const url = await postService.uploadMedia(file, currentUploadType === 'image' ? 'posts_images' : 'posts_media');
      
      if (currentUploadType === 'image') {
        execCommand('insertImage', url);
      } else if (currentUploadType === 'video') {
        execCommand('insertHTML', `<video controls class="w-full aspect-video rounded-2xl my-6 shadow-lg"><source src="${url}" type="${file.type}">Seu navegador não suporta vídeos.</video><p><br></p>`);
      } else if (currentUploadType === 'audio') {
        execCommand('insertHTML', `<audio controls src="${url}" class="w-full my-4 shadow-sm border rounded-full p-2 bg-slate-50"></audio><p><br></p>`);
      }
    } catch (err) {
      alert("Erro ao carregar o ficheiro. Tente novamente.");
    } finally {
      setUploadingMedia(false);
      setCurrentUploadType(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('acacias_mock_user');
    try { await signOut(auth); } catch (e) {}
    navigate('/login');
    window.location.reload();
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    const content = editorRef.current?.innerHTML || '';
    if (!imageFile) return alert('É obrigatório adicionar uma foto de capa para o blog.');
    if (!formData.title) return alert('O título é fundamental para SEO e leitura.');
    
    setSubmitting(true);
    setError('');
    
    try {
      await postService.createPost({ ...formData, content }, imageFile);
      setIsEditorOpen(false);
      resetForm();
      fetchPosts();
    } catch (err: any) {
      setError('Falha ao comunicar com o servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'Impacto Social', author: 'Equipe Acácias' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAiRefine = async () => {
    const currentContent = editorRef.current?.innerText || '';
    if (!formData.title || !currentContent) return alert("Escreva um pouco para que a IA possa ajudar.");
    
    setAiAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é o editor do blog Acácias Wela. Transforme o rascunho em um post profissional de impacto social. Use HTML (h2, p, strong). Título: ${formData.title}. Conteúdo: ${currentContent}`,
      });
      if (response.text && editorRef.current) {
        editorRef.current.innerHTML = response.text;
        updateContent();
      }
    } catch (err) {
      alert("IA indisponível no momento.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Hidden File Input for Toolbar */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleMediaUpload} />

      {/* Dashboard Sidebar */}
      <aside className="w-20 md:w-64 bg-slate-900 text-white flex flex-col transition-all duration-300">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-600/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-black hidden md:block tracking-tight">Acácias <span className="text-emerald-400">Pro</span></h2>
        </div>
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button className="w-full flex items-center justify-center md:justify-start gap-4 px-5 py-4 bg-emerald-600/10 text-emerald-400 rounded-2xl font-bold transition">
            <FileText className="w-6 h-6" /> 
            <span className="hidden md:block">Gerir Blog</span>
          </button>
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center md:justify-start gap-4 px-5 py-4 hover:bg-red-500/10 text-red-400 rounded-2xl font-bold transition">
            <LogOut className="w-6 h-6" /> 
            <span className="hidden md:block">Terminar</span>
          </button>
        </div>
      </aside>

      {/* Main List */}
      <main className="flex-grow overflow-y-auto bg-slate-50">
        <div className="max-w-6xl mx-auto p-12">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Estúdio de Notícias</h1>
              <p className="text-slate-500 font-medium mt-2">Dê voz às iniciativas do Acácias Wela.</p>
            </div>
            <button 
              onClick={() => { resetForm(); setIsEditorOpen(true); }}
              className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-700 transition shadow-2xl shadow-emerald-200 transform hover:-translate-y-1"
            >
              <Plus className="w-6 h-6" /> Nova Publicação
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-200 group relative hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => post.id && postService.deletePost(post.id, post.imageUrl).then(fetchPosts)} className="p-4 bg-white/95 backdrop-blur shadow-xl text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
                <div className="h-56 overflow-hidden bg-slate-200">
                  <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
                </div>
                <div className="p-10">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 block">{post.category}</span>
                  <h3 className="font-black text-xl mb-4 line-clamp-2 text-slate-800 leading-tight">{post.title}</h3>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-black border-t pt-6 mt-4">
                    <span>{post.author}</span>
                    <span>{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FULL SCREEN PRO EDITOR */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-[#f8f9fa] z-[100] flex flex-col animate-in fade-in duration-500">
          
          {/* Top Navbar */}
          <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-6 flex-1">
              <button onClick={() => setIsEditorOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition text-slate-400">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <div className="w-11 h-11 bg-[#f37021] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-200/50">B</div>
              <input 
                type="text" 
                placeholder="Introduza o título da sua postagem..."
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="flex-1 max-w-3xl bg-transparent text-2xl font-bold text-slate-800 outline-none px-4 placeholder:text-slate-200 tracking-tight"
              />
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`p-3 rounded-2xl transition group relative ${isPreviewMode ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <Eye className="w-6 h-6" />
                <span className="absolute top-full right-0 mt-3 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition font-bold uppercase tracking-widest pointer-events-none">Visualizar</span>
              </button>
              <button 
                onClick={handleCreatePost}
                disabled={submitting}
                className="bg-[#f37021] text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 hover:bg-[#d95e1a] transition shadow-xl shadow-orange-100 disabled:opacity-50 text-sm"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rotate-[-45deg]" />}
                {submitting ? 'A Publicar...' : 'Publicar Agora'}
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className={`p-3 rounded-2xl transition ${showSettings ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Blogger-Style Pro Toolbar */}
          <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-sm">
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
              <button onClick={() => execCommand('undo')} className="p-2.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition"><Undo className="w-5 h-5" /></button>
              <button onClick={() => execCommand('redo')} className="p-2.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition"><Redo className="w-5 h-5" /></button>
            </div>
            
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            
            <select 
              onChange={(e) => execCommand('formatBlock', e.target.value)}
              className="bg-slate-50 text-xs font-black text-slate-600 outline-none px-4 py-2.5 rounded-xl border border-slate-100 cursor-pointer hover:border-slate-300 transition uppercase tracking-widest"
            >
              <option value="p">Texto Normal</option>
              <option value="h2">Título Secundário</option>
              <option value="h3">Subtítulo Médio</option>
            </select>

            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
              <button onClick={() => execCommand('bold')} className="p-2.5 hover:bg-white rounded-lg text-slate-600 hover:text-black transition"><Bold className="w-5 h-5" /></button>
              <button onClick={() => execCommand('italic')} className="p-2.5 hover:bg-white rounded-lg text-slate-600 hover:text-black transition"><Italic className="w-5 h-5" /></button>
              <button onClick={() => execCommand('underline')} className="p-2.5 hover:bg-white rounded-lg text-slate-600 hover:text-black transition"><Underline className="w-5 h-5" /></button>
              <button onClick={() => execCommand('formatBlock', 'blockquote')} className="p-2.5 hover:bg-white rounded-lg text-slate-600 hover:text-black transition"><Quote className="w-5 h-5" /></button>
            </div>
            
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
              <button onClick={() => execCommand('justifyLeft')} className="p-2.5 hover:bg-white rounded-lg text-slate-500 transition"><AlignLeft className="w-5 h-5" /></button>
              <button onClick={() => execCommand('justifyCenter')} className="p-2.5 hover:bg-white rounded-lg text-slate-500 transition"><AlignCenter className="w-5 h-5" /></button>
              <button onClick={() => execCommand('justifyRight')} className="p-2.5 hover:bg-white rounded-lg text-slate-500 transition"><AlignRight className="w-5 h-5" /></button>
            </div>
            
            <div className="w-px h-8 bg-slate-200 mx-1"></div>

            <button onClick={() => execCommand('insertUnorderedList')} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition"><List className="w-5 h-5" /></button>
            <button onClick={() => execCommand('insertOrderedList')} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition"><ListOrdered className="w-5 h-5" /></button>

            <div className="w-px h-8 bg-slate-200 mx-1"></div>

            {/* REAL FILE ACCESS BUTTONS */}
            <div className="flex items-center gap-2 px-2">
              <button 
                onClick={() => triggerUpload('image')} 
                disabled={uploadingMedia}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition text-[10px] font-black uppercase tracking-widest border border-emerald-100 disabled:opacity-50"
              >
                {uploadingMedia && currentUploadType === 'image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} Foto
              </button>
              <button 
                onClick={() => triggerUpload('video')} 
                disabled={uploadingMedia}
                className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition text-[10px] font-black uppercase tracking-widest border border-sky-100 disabled:opacity-50"
              >
                {uploadingMedia && currentUploadType === 'video' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />} Vídeo
              </button>
              <button 
                onClick={() => triggerUpload('audio')} 
                disabled={uploadingMedia}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition text-[10px] font-black uppercase tracking-widest border border-amber-100 disabled:opacity-50"
              >
                {uploadingMedia && currentUploadType === 'audio' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />} Áudio
              </button>
            </div>
            
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            
            <button 
              onClick={handleAiRefine} 
              disabled={aiAnalyzing}
              className="ml-auto flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-2xl hover:opacity-90 transition text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <BrainCircuit className="w-5 h-5" /> {aiAnalyzing ? 'IA a escrever...' : 'Redigir com IA'}
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden relative bg-[#f4f5f7]">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center p-8 md:p-16">
              <div className="w-full max-w-[900px] bg-white min-h-[100vh] shadow-xl border border-slate-200 rounded-2xl p-16 md:p-24 relative overflow-hidden">
                {isPreviewMode ? (
                  <div className="prose prose-slate max-w-none">
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-8">{formData.category}</div>
                    <h1 className="text-5xl font-black mb-12 text-slate-900 border-b pb-8 leading-tight tracking-tight">{formData.title || "Sem Título"}</h1>
                    {imagePreview && <img src={imagePreview} className="w-full h-[400px] object-cover rounded-[2rem] mb-12 shadow-2xl" />}
                    <div className="post-content text-slate-700 leading-relaxed text-xl" dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }} />
                  </div>
                ) : (
                  <div className="relative">
                    {/* Line numbering simulation style like Blogger/Editor */}
                    <div className="absolute top-0 left-[-60px] w-12 flex flex-col items-end pt-1 text-[10px] text-slate-200 select-none font-mono">
                      {Array.from({length: 40}).map((_, i) => <div key={i} className="mb-5 leading-none">{i+1}</div>)}
                    </div>
                    
                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={updateContent}
                      className="post-content w-full h-full min-h-[80vh] outline-none text-xl text-slate-800 leading-relaxed font-medium"
                      placeholder="Comece a digitar a sua história..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Inspector */}
            {showSettings && (
              <aside className="w-80 bg-white border-l border-slate-200 p-8 overflow-y-auto hidden lg:block animate-in slide-in-from-right-4 duration-300 shadow-2xl">
                <div className="flex items-center justify-between mb-12 border-b pb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Painel de Publicação</h3>
                  <button onClick={() => setShowSettings(false)} className="text-slate-300 hover:text-slate-900 transition"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block flex items-center gap-2">
                      <FileUp className="w-3 h-3 text-emerald-500" /> Foto de Capa (Principal)
                    </label>
                    <div className="relative group">
                      <input type="file" accept="image/*" onChange={handleCoverImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {imagePreview ? (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-inner">
                          <img src={imagePreview} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest bg-emerald-600 px-4 py-2 rounded-full shadow-lg">Mudar Capa</span>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-emerald-50 hover:border-emerald-200 transition duration-500 group">
                          <ImageIcon className="w-10 h-10 mb-3 group-hover:scale-110 transition" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600">Upload da Capa</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Marcador / Categoria</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 focus:ring-2 ring-emerald-500 outline-none transition"
                    >
                      <option>Impacto Social</option>
                      <option>Capacitação</option>
                      <option>Empreendedorismo</option>
                      <option>Eventos Unitários</option>
                      <option>Cursos Acácias</option>
                      <option>Relatórios Anuais</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Autor da Publicação</label>
                    <input 
                      type="text" 
                      value={formData.author} 
                      onChange={e => setFormData({...formData, author: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold text-slate-600 focus:ring-2 ring-emerald-500 outline-none transition" 
                    />
                  </div>

                  <div className="pt-12 mt-12 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 italic leading-relaxed text-center font-medium">
                      "A cada palavra, você transforma o futuro de um jovem angolano."
                    </p>
                    <div className="flex justify-center mt-6">
                      <div className="w-10 h-1 bg-emerald-100 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
