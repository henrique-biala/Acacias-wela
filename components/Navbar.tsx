
import React, { useState } from 'react';
// Fix: Use namespace import for react-router-dom to resolve named export errors
import * as ReactRouterDom from 'react-router-dom';
import { Menu, X, TreeDeciduous } from 'lucide-react';
import { LOGO_URL } from '../constants';

const { Link, useLocation } = ReactRouterDom;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Sobre Nós', path: '/sobre' },
    { name: 'Projetos', path: '/projetos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contatos', path: '/contatos' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-14 md:h-16 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {!imgError ? (
                  <img 
                    src={LOGO_URL} 
                    alt="Acacias Wela Logo" 
                    className="h-full w-auto object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="bg-emerald-50 p-2 rounded-xl">
                    <TreeDeciduous className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                  </div>
                )}
              </div>
              <div className="flex flex-col border-l border-slate-100 pl-3">
                <span className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-none">
                  Acacias <span className="text-emerald-600 font-extrabold">Wela</span>
                </span>
                <span className="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-[0.15em] font-bold mt-1">Capacitação Juvenil</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-emerald-600 font-bold border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-emerald-600'
                } transition-all duration-200 px-1 py-2 text-xs uppercase tracking-widest`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="ml-4 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-emerald-600 p-2"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-4 text-base font-bold rounded-xl ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-4 text-base font-bold text-sky-600 border-t border-slate-50"
            >
              Painel Administrativo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
