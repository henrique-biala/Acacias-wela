
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../types';

const COLLECTION_NAME = 'posts';

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
  },

  async getLatestPosts(count: number = 3): Promise<Post[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
  },

  /**
   * Converte um arquivo em Base64 com compressão
   * @param isGallery Se for para galeria, comprime mais para economizar espaço no Firestore
   */
  async uploadMedia(file: File, isGallery: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Reduzimos o tamanho máximo para galeria para caber mais fotos
          const MAX_DIM = isGallery ? 800 : 1200; 
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Qualidade menor para galeria (0.5) vs capa (0.7)
          const dataUrl = canvas.toDataURL('image/jpeg', isGallery ? 0.5 : 0.7);
          resolve(dataUrl);
        };
      };
      reader.onerror = error => reject(error);
    });
  },

  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'gallery'>, imageFile: File, galleryFiles: File[] = []): Promise<string> {
    // 1. Converter imagem de capa
    const imageUrl = await this.uploadMedia(imageFile, false);

    // 2. Converter imagens da galeria (em paralelo)
    const gallery = await Promise.all(
      galleryFiles.map(file => this.uploadMedia(file, true))
    );

    // 3. Salvar no Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      imageUrl,
      gallery,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};
