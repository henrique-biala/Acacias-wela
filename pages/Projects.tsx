
import React from 'react';
import { PROJECTS } from '../constants';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6">Nossos Projetos & Ações</h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto">
            Trabalhamos na capacitação juvenil através de iniciativas práticas que geram resultados reais na vida dos jovens.
          </p>
        </header>

        <div className="space-y-24">
          {PROJECTS.map((project, index) => (
            <div key={project.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-600/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="relative w-full h-[450px] object-cover rounded-[2.5rem] shadow-2xl"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <span className="inline-block px-4 py-2 bg-sky-100 text-sky-700 font-bold text-xs uppercase tracking-widest rounded-full">
                  {project.impact}
                </span>
                <h2 className="text-4xl font-bold text-slate-800">{project.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {project.description}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Capacitação Técnica
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Networking com Profissionais
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Certificado de Participação
                  </li>
                </ul>
                <div className="pt-6">
                  <Link to="/contatos" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-xl">
                    Quero Participar <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-32 bg-emerald-600 rounded-[3rem] p-16 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Tem uma ideia para colaborar?</h2>
          <p className="text-emerald-50 text-xl mb-10 max-w-2xl mx-auto">
            Estamos sempre abertos a novos parceiros e pessoas dispostas a elevar o projeto ao próximo nível.
          </p>
          <Link to="/contatos" className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition shadow-2xl">
            Fale com a gente agora
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Projects;
