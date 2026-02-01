
import React from 'react';
import { Calendar, Users, Heart, Target } from 'lucide-react';

const About: React.FC = () => {
  const founders = [
    { name: 'Ana Binga', role: 'Cofundadora' },
    { name: 'Edgar Reinaldo', role: 'Cofundador' },
    { name: 'Wandi Ernesto', role: 'Cofundador' }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <section className="bg-slate-900 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6">Nossa História</h1>
          <p className="text-slate-400 text-xl">Uma jornada de capacitação e impacto que começou em 2020.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg text-slate-600 max-w-none">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Quem Somos</h2>
            <p className="mb-6">
              O <strong>Acácias Wela</strong> é um projeto juvenil focado no treinamento profissional e pessoal, criado oficialmente no dia <strong>8 de Março de 2020</strong>. Nossa missão nasceu da vontade de capacitar a juventude angolana para enfrentar os desafios do mercado e da vida pessoal com excelência.
            </p>
            <p className="mb-6">
              O projeto foi fundado por <strong>Ana Binga, Edgar Reinaldo e Wandi Ernesto</strong>, três visionários que acreditam que o desenvolvimento pessoal é a base para o sucesso profissional. O nosso foco principal é incentivar os jovens a empreender, a desenvolverem as suas artes e a trabalharem em seu crescimento contínuo.
            </p>
            
            <div className="bg-emerald-50 p-10 rounded-[2.5rem] my-12 border border-emerald-100">
              <h3 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6" /> O Que Pretendemos
              </h3>
              <p className="text-emerald-900/80 italic text-lg leading-relaxed">
                "Pretendemos continuar a crescer em todas as áreas. Para isso, precisamos de pessoas dispostas a elevar este grande projeto ao mais alto nível e, com isso, impactar positivamente muitas vidas em nossa comunidade."
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-8">Nosso Trajeto (5 Anos)</h2>
            <p className="mb-8">
              Nestes 5 anos de existência, o projeto Acácias Wela consolidou-se através de diversas ações práticas:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 list-none p-0 mb-12">
              <li className="bg-slate-50 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-sky-100 p-2 rounded-lg text-sky-600"><Users className="w-5 h-5" /></div>
                <div>
                  <strong className="block text-slate-800">Palestras & Conferências</strong>
                  Focadas em empreendedorismo e mentalidade de sucesso.
                </div>
              </li>
              <li className="bg-slate-50 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Heart className="w-5 h-5" /></div>
                <div>
                  <strong className="block text-slate-800">Feiras Culturais</strong>
                  Espaço dedicado à descoberta e promoção de novos talentos artísticos.
                </div>
              </li>
              <li className="bg-slate-50 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Calendar className="w-5 h-5" /></div>
                <div>
                  <strong className="block text-slate-800">Cursos de Férias</strong>
                  Os Cursos ACÁCIAS são referência em treinamento intensivo para jovens.
                </div>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Fundadores</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {founders.map(founder => (
                <div key={founder.name} className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${founder.name}&background=10b981&color=fff`} alt={founder.name} />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{founder.name}</h4>
                  <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest">{founder.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
