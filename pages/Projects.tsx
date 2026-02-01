
import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
// Fix: Use namespace import for react-router-dom to resolve named export errors
import * as ReactRouterDom from 'react-router-dom';
import { siteService } from '../services/siteService';
import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../constants';

const { Link } = ReactRouterDom;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteService.getConfig().then(config => {
      setProjects(config?.projects || DEFAULT_PROJECTS);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-20">
          <h1 className="text-5xl font-black mb-6">Nossas Ações de Impacto</h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Explore os programas que estão mudando a realidade da juventude em Angola.
          </p>
        </header>

        <div className="space-y-24">
          {projects.map((project, index) => (
            <div key={project.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-600/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <img 
                    src={project.image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"} 
                    alt={project.title} 
                    className="relative w-full h-[450px] object-cover rounded-[2.5rem] shadow-2xl"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <span className="inline-block px-4 py-2 bg-sky-100 text-sky-700 font-bold text-xs uppercase tracking-widest rounded-full">
                  {project.impact}
                </span>
                <h2 className="text-4xl font-black text-slate-800">{project.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {project.description}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700 font-bold">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Conteúdo Prático e Real
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Mentoria de Líderes
                  </li>
                </ul>
                <div className="pt-6">
                  <Link to="/contatos" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-xl">
                    Quero Saber Mais <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
