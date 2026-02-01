
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// INSTRUÇÕES: Substitua pelos seus dados do Console do Firebase
// No Firebase Console: Configurações do Projeto > Geral > Seus Aplicativos
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Como o ambiente pode não ter as chaves reais imediatamente, 
// o app vai rodar em modo "Mock" se a API KEY não for válida.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
