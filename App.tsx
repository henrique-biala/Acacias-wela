
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { LOGO_URL } from './constants';
import { TreeDeciduous, AlertTriangle } from 'lucide-react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const Footer = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <footer className="bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-16">
        <div className="col-span-2">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-auto flex items-center justify-center p-3 bg-white rounded-3xl shadow-xl shadow-emerald-900/20">
              {!imgError ? (
                <img 
                  src={LOGO_URL} 
                  alt="Logo Acácias Wela" 
                  className="h-full w-auto object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <TreeDeciduous className="w-12 h-12 text-emerald-600" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold">Acacias <span className="text-emerald-400">Wela</span></h2>
              <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-widest">Treinamento Profissional e Pessoal</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-sm mb-10 leading-relaxed">
            Elevando o potencial da juventude angolana através da capacitação prática e desenvolvimento humano desde 2020.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-8 text-white uppercase tracking-widest text-xs border-b border-white/10 pb-4">Navegação</h4>
          <ul className="space-y-4 text-slate-400 font-medium">
            <li><a href="#/" className="hover:text-emerald-400 transition-colors">Início</a></li>
            <li><a href="#/sobre" className="hover:text-emerald-400 transition-colors">Nossa História</a></li>
            <li><a href="#/projetos" className="hover:text-emerald-400 transition-colors">Nossas Ações</a></li>
            <li><a href="#/blog" className="hover:text-emerald-400 transition-colors">Blog & Notícias</a></li>
            <li><a href="#/contatos" className="hover:text-emerald-400 transition-colors">Contatos</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-16 mt-16 border-t border-white/5 text-center text-slate-500 text-xs font-medium tracking-wide">
        &copy; {new Date().getFullYear()} Acácias Wela.
      </div>
    </footer>
  );
};

const ProtectedRoute = ({ children, user, loading }: { children?: React.ReactNode, user: any, loading: boolean }) => {
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configMissing, setConfigMissing] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          const mockUserStr = localStorage.getItem('acacias_mock_user');
          setUser(mockUserStr ? JSON.parse(mockUserStr) : null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase Auth não configurado corretamente.");
      setLoading(false);
      // Se falhar o auth, tentamos ver se é o mock user
      const mockUserStr = localStorage.getItem('acacias_mock_user');
      if (mockUserStr) setUser(JSON.parse(mockUserStr));
    }
  }, []);

  return (
    <Router>
      <AppContent user={user} loading={loading} />
    </Router>
  );
};

const AppContent = ({ user, loading }: { user: any, loading: boolean }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/projetos" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contatos" element={<Contact />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} loading={loading}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;
