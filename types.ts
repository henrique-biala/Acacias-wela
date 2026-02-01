
export interface Post {
  id?: string;
  title: string;
  content: string;
  imageUrl: string;
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

export interface SiteConfig {
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
    badge: string;
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
  };
  projects: Project[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
