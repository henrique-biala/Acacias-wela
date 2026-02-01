
import React, { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import { Post } from '../types';
import { Calendar, User, Tag, ChevronRight } from 'lucide-react';

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
          <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">Histórias de Impacto</h1>
          <p className="text-slate-500 text-xl font-medium leading-relaxed">
            Acompanhe o crescimento da juventude angolana através de nossas ações e treinamentos.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-20">
            {posts.length > 0 ? (
              posts.map(post => (
                <article key={post.id} className="bg-white rounded-[4rem] shadow-sm overflow-hidden border border-slate-100 group transition-all duration-700 hover:shadow-2xl hover:shadow-emerald-900/5">
                  <div className="flex flex-col">
                    <div className="w-full overflow-hidden h-[400px]">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                      />
                    </div>
                    <div className="p-12 md:p-16 flex flex-col">
                      <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase mb-8 tracking-[0.2em]">
                        <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 text-emerald-600"><Tag className="w-3 h-3" /> {post.category}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 group-hover:text-emerald-600 transition-colors leading-[1.1] tracking-tight">
                        {post.title}
                      </h2>
                      <div 
                        className="post-content text-slate-600 mb-10 text-lg leading-relaxed line-clamp-4"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                      <div className="flex items-center justify-between mt-auto pt-10 border-t border-slate-50">
                        <span className="flex items-center gap-3 text-xs text-slate-500 font-black uppercase tracking-widest">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-emerald-600"><User className="w-5 h-5" /></div> {post.author || 'Equipe Acácias'}
                        </span>
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-600 transition-all text-xs uppercase tracking-widest group">
                          Ler Completo <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-300 text-2xl font-black uppercase tracking-widest">Aguardando Novas Notícias...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition duration-1000"></div>
              <h3 className="text-4xl font-black mb-6 relative z-10 leading-tight">Mantenha-se Atualizado</h3>
              <p className="text-slate-400 mb-10 font-medium relative z-10 text-lg">Receba as novidades sobre os nossos cursos e eventos diretamente.</p>
              <form className="space-y-5 relative z-10">
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 ring-emerald-500 transition-all"
                />
                <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black hover:bg-emerald-700 transition shadow-xl shadow-emerald-900/40 uppercase text-xs tracking-widest">
                  Inscrever Agora
                </button>
              </form>
            </div>

            <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black mb-10 text-slate-400 uppercase tracking-[0.4em] border-b border-slate-50 pb-6">Categorias</h3>
              <ul className="space-y-6">
                {['Cursos Acácias', 'Impacto Social', 'Empreendedorismo', 'Educação', 'Notícias'].map(cat => (
                  <li key={cat}>
                    <button className="flex items-center justify-between w-full text-slate-500 hover:text-emerald-600 font-black transition-all group py-2">
                      <span className="text-base">{cat}</span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:translate-x-2 transition-all">
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
