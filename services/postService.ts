
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
   * Converte um arquivo em Base64 com compressão para caber no Firestore (limite 1MB)
   */
  async uploadMedia(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Qualidade 0.7 para garantir que fique bem abaixo de 1MB
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
      reader.onerror = error => reject(error);
    });
  },

  async createPost(post: Omit<Post, 'id' | 'createdAt'>, imageFile: File): Promise<string> {
    // 1. Converter imagem para Base64 otimizado
    const imageUrl = await this.uploadMedia(imageFile);

    // 2. Salvar no Firestore
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      imageUrl,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updatePost(id: string, post: Partial<Post>, imageFile?: File): Promise<void> {
    let updateData = { ...post };

    if (imageFile) {
      updateData.imageUrl = await this.uploadMedia(imageFile);
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updateData);
  },

  async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    // Não é mais necessário deletar do storage
  }
};
