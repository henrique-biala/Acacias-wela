
export interface Post {
  id?: string;
  title: string;
  content: string;
  imageUrl: string;
  gallery?: string[]; // Array de strings Base64 (pode conter imagens ou vídeos)
  category: string;
  createdAt: any;
  author: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  impact: string;
}

export interface Founder {
  name: string;
  role: string;
  imageUrl?: string;
}

export interface SiteNotification {
  active: boolean;
  message: string;
  link?: string;
  type: 'success' | 'info' | 'warning';
}

export interface SiteConfig {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
    badge: string;
    homeTitle?: string;
    homeBio?: string;
  };
  about: {
    title: string;
    text: string;
    missionQuote: string;
    founders: Founder[];
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    facebook?: string;
  };
  projects: Project[];
  notification?: SiteNotification;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}