
import React, { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import { Post } from '../types';
import { Calendar, Tag, LayoutGrid, PlayCircle, X, ArrowRight, Maximize2 } from 'lucide-react';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await postService.getAllPosts();
        setPosts(allPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Fecha modais com a tecla Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPost(null);
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const isVideo = (data: string) => data.startsWith('data:video/') || data.includes('video');

  // Função para limpar HTML e truncar texto
  const getExcerpt = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    return text.length > 160 ? text.substring(0, 160) + "..." : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando Notícias...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <div className="bg-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] py-1 px-4 rounded-full inline-block mb-8">Comunidade Wela</div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-slate-900 leading-tight">Ações em Benguela</h1>
          <p className="text-slate-500 text-base md:text-xl font-medium leading-relaxed">
            Acompanhe o impacto real dos nossos treinamentos e eventos através de relatos e multimédia.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-12 md:gap-16">
          <div className="lg:col-span-2 space-y-12 md:space-y-20">
            {posts.length > 0 ? (
              posts.map(post => (
                <article key={post.id} className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm overflow-hidden border border-slate-100 group transition-all duration-500 hover:shadow-xl">
                  <div className="flex flex-col">
                    <div 
                      className="w-full overflow-hidden h-[250px] md:h-[400px] cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
                      />
                    </div>
                    <div className="p-8 md:p-12">
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-400 uppercase mb-6 tracking-[0.2em]">
                        <span className="bg-emerald-50 px-3 py-1.5 rounded-full text-emerald-600">{post.category}</span>
                        <span>{new Date(post.createdAt?.seconds * 1000).toLocaleDateString('pt-PT')}</span>
                      </div>
                      
                      <h2 
                        className="text-2xl md:text-4xl font-black mb-6 text-slate-900 cursor-pointer hover:text-emerald-600 transition-colors leading-tight tracking-tight"
                        onClick={() => setSelectedPost(post)}
                      >
                        {post.title}
                      </h2>
                      
                      <p className="text-slate-500 mb-8 text-base md:text-lg leading-relaxed line-clamp-3">
                        {getExcerpt(post.content)}
                      </p>

                      <button 
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest group/btn"
                      >
                        Ler Artigo Completo <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <LayoutGrid className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Sem publicações recentes</p>
              </div>
            )}
          </div>

          <aside className="space-y-8 h-fit sticky top-32">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full"></div>
              <h3 className="text-2xl font-black mb-4 relative z-10">Newsletter</h3>
              <p className="text-slate-400 mb-8 text-sm relative z-10">Receba notícias de Benguela no seu e-mail.</p>
              <form className="space-y-4 relative z-10">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:ring-2 ring-emerald-500 font-bold text-sm"
                />
                <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black hover:bg-emerald-700 transition uppercase text-[10px] tracking-widest">
                  Subscrever
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* MODAL DE LEITURA COMPLETA (POST) */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedPost(null)}></div>
          
          <div className="relative bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] md:rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
             <header className="sticky top-0 z-20 p-6 md:p-8 border-b bg-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Tag className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{selectedPost.category}</h4>
                    <p className="text-[10px] font-bold text-slate-300">{new Date(selectedPost.createdAt?.seconds * 1000).toLocaleDateString('pt-PT')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="p-3 md:p-4 hover:bg-slate-100 rounded-2xl transition"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
             </header>

             <div className="flex-grow overflow-y-auto p-8 md:p-16 no-scrollbar">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 leading-tight tracking-tight">
                  {selectedPost.title}
                </h2>
                
                <img 
                  src={selectedPost.imageUrl} 
                  className="w-full h-[250px] md:h-[500px] object-cover rounded-[2rem] md:rounded-[3rem] mb-12 shadow-lg" 
                  alt="Capa" 
                />

                <div 
                  className="post-content text-slate-600 text-lg md:text-xl leading-relaxed mb-16"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                {/* GALERIA INTERNA */}
                {selectedPost.gallery && selectedPost.gallery.length > 0 && (
                  <div className="space-y-10 border-t border-slate-100 pt-16">
                     <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                       <PlayCircle className="text-emerald-500" /> Registos do Evento
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {selectedPost.gallery.map((media, idx) => (
                         <div key={idx} className="group/media relative rounded-[2rem] overflow-hidden shadow-md bg-slate-900 aspect-video md:aspect-square">
                            {isVideo(media) ? (
                              <video src={media} controls className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <img 
                                  src={media} 
                                  className="w-full h-full object-cover transition duration-500 group-hover/media:scale-105" 
                                  alt="Galeria" 
                                />
                                <div 
                                  className="absolute inset-0 bg-black/20 opacity-0 group-hover/media:opacity-100 transition flex items-center justify-center cursor-pointer"
                                  onClick={() => setSelectedImage(media)}
                                >
                                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white border border-white/30">
                                    <Maximize2 className="w-6 h-6" />
                                  </div>
                                </div>
                              </>
                            )}
                         </div>
                       ))}
                     </div>
                  </div>
                )}
             </div>

             <footer className="p-8 border-t bg-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Autor: {selectedPost.author || 'Equipe Acácias'}</span>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="text-emerald-600 font-bold text-sm"
                >
                  Voltar ao Blog
                </button>
             </footer>
          </div>
        </div>
      )}

      {/* LIGHTBOX DE IMAGEM (PARA EVITAR TELA BRANCA) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"></div>
          <button className="absolute top-8 right-8 text-white p-4 hover:bg-white/10 rounded-full transition z-20">
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            className="relative max-w-full max-h-full object-contain rounded-xl shadow-2xl z-10" 
            alt="Ampliada"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default Blog;
