
export interface Post {
  id?: string;
  title: string;
  content: string;
  imageUrl: string;
  gallery?: string[];
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

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  imageUrl?: string;
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
    facebook?: string;
  };
  help: {
    iban: string;
    bankName: string;
    accountHolder: string;
    volunteerText: string;
  };
  projects: Project[];
  testimonials: Testimonial[];
}
