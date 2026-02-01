
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
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

  async uploadMedia(file: File, folder: string = 'media'): Promise<string> {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  async createPost(post: Omit<Post, 'id' | 'createdAt'>, imageFile: File): Promise<string> {
    // 1. Upload cover image
    const imageUrl = await this.uploadMedia(imageFile, 'covers');

    // 2. Save to Firestore
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
      updateData.imageUrl = await this.uploadMedia(imageFile, 'covers');
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updateData);
  },

  async deletePost(id: string, imageUrl: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.warn("Storage item already gone or error:", error);
    }
  }
};
