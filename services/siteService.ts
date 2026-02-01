
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteConfig } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../constants';

const CONFIG_DOC_ID = 'main_config';
const COLLECTION = 'site_settings';

export const siteService = {
  async getConfig(): Promise<SiteConfig | null> {
    try {
      const docRef = doc(db, COLLECTION, CONFIG_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SiteConfig;
      }
      
      // Se for a primeira vez, retorna nulo para que o componente use o estado inicial
      return null;
    } catch (error) {
      console.error("Erro ao carregar configurações do Firebase:", error);
      return null;
    }
  },

  async saveConfig(config: SiteConfig): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, CONFIG_DOC_ID);
      // setDoc com merge garante que o documento seja criado ou atualizado
      await setDoc(docRef, config, { merge: true });
    } catch (error) {
      console.error("Erro ao salvar configurações no Firebase:", error);
      throw error;
    }
  }
};
