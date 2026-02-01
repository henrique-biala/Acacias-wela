
import React, { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import { Post } from '../types';
import { Calendar, User, Tag, ImageIcon, LayoutGrid, PlayCircle } from 'lucide-react';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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

  const isVideo = (data: string) => data.startsWith('data:video/') || data.includes('video');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-24 text-center max-w-3xl mx-auto">
          <div className="bg-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] py-1 px-4 rounded-full inline-block mb-8">Comunidade Wela</div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">Ações em Benguela</h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Explora os nossos treinamentos através de fotos e vídeos dos eventos reais.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-24">
            {posts.length > 0 ? (
              posts.map(post => (
                <article key={post.id} className="bg-white rounded-[4rem] shadow-sm overflow-hidden border border-slate-100 group transition-all duration-700 hover:shadow-2xl">
                  <div className="flex flex-col">
                    <div className="w-full overflow-hidden h-[300px] md:h-[450px]">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-1000"
                      />
                    </div>
                    <div className="p-8 md:p-16 flex flex-col">
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-400 uppercase mb-8 tracking-[0.2em]">
                        <span className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 text-emerald-600"><Tag className="w-3 h-3" /> {post.category}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(post.createdAt?.seconds * 1000).toLocaleDateString('pt-PT')}</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-5xl font-black mb-8 text-slate-900 group-hover:text-emerald-600 transition-colors leading-[1.1] tracking-tight">
                        {post.title}
                      </h2>
                      
                      <div 
                        className="post-content text-slate-600 mb-10 text-base md:text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />

                      {/* GALERIA MULTIMÉDIA (Fotos e Vídeos) */}
                      {post.gallery && post.gallery.length > 0 && (
                        <div className="mb-12 p-6 md:p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                           <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3">
                             Conteúdo Extra do Evento
                           </h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             {post.gallery.map((media, idx) => (
                               <div key={idx} className="aspect-video md:aspect-square rounded-3xl overflow-hidden shadow-md group/img bg-slate-900 relative">
                                  {isVideo(media) ? (
                                    <video 
                                      src={media} 
                                      controls 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <img 
                                      src={media} 
                                      className="w-full h-full object-cover group-hover/img:scale-110 transition duration-500 cursor-zoom-in" 
                                      alt={`Multimédia ${idx + 1}`}
                                      onClick={() => window.open(media, '_blank')}
                                    />
                                  )}
                                  {isVideo(media) && (
                                    <div className="absolute top-4 right-4 bg-emerald-600 text-white p-2 rounded-full shadow-lg pointer-events-none">
                                      <PlayCircle className="w-4 h-4" />
                                    </div>
                                  )}
                               </div>
                             ))}
                           </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-10 border-t border-slate-50">
                        <span className="flex items-center gap-3 text-xs text-slate-500 font-black uppercase tracking-widest">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-emerald-600 font-bold">W</div> {post.author || 'Equipe Acácias'}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                <LayoutGrid className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                <p className="text-slate-300 text-xl font-black uppercase tracking-widest">Aguardando Novas Histórias...</p>
              </div>
            )}
          </div>

          <aside className="space-y-12 h-fit sticky top-32">
            <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
              <h3 className="text-3xl font-black mb-6 relative z-10 leading-tight">Newsletter Wela</h3>
              <p className="text-slate-400 mb-8 font-medium relative z-10">Receba atualizações sobre os cursos em Benguela diretamente no seu e-mail.</p>
              <form className="space-y-4 relative z-10">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:ring-2 ring-emerald-500 transition-all font-bold"
                />
                <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black hover:bg-emerald-700 transition uppercase text-[10px] tracking-widest">
                  Subscrever
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
