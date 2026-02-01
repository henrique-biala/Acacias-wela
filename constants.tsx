
import React from 'react';
import { Project } from './types';

export const COLORS = {
  primary: 'emerald-600',
  secondary: 'sky-600',
  accent: 'amber-500',
};

// URL oficial do logo fornecida pelo usuário
export const LOGO_URL = 'https://i.imgur.com/7KLKYM1.png'; 

export const CONTACT_INFO = {
  phone: '+244 933 244 547',
  location: 'Benguela, Angola',
  email: 'contato@acaciaswela.org'
};

export const SOCIAL_LINKS = {
  // Link verificado conforme solicitado
  facebook: 'https://www.facebook.com/profile.php?id=100066542528179'
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Cursos de Férias ACÁCIAS',
    description: 'Programas intensivos de treinamento e capacitação realizados durante o período de pausa letiva, focados em competências práticas.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    impact: 'Capacitação Intensiva'
  },
  {
    id: '2',
    title: 'Conferências de Empreendedorismo',
    description: 'Ciclos de palestras e debates voltados para incentivar jovens a criar seus próprios negócios e desenvolver mentalidade empreendedora.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    impact: 'Foco em Negócios'
  },
  {
    id: '3',
    title: 'Feiras Culturais',
    description: 'Eventos que dão abertura a novos talentos, permitindo que jovens desenvolvam suas artes e as apresentem à comunidade.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    impact: 'Arte e Cultura'
  }
];