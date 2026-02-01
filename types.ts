
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

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
