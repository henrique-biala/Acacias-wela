
// Fix: Use namespace import for firebase/app to resolve named export errors in this environment
import * as firebaseApp from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * CONFIGURAÇÃO REAL DO FIREBASE - ACACIAS WELA
 * Conectado ao projeto: acacias-wela
 */
const firebaseConfig = {
  apiKey: "AIzaSyCWYXUDfIDl1nuhWfAZZp3aBhmaULiTI0Q",
  authDomain: "acacias-wela.firebaseapp.com",
  databaseURL: "https://acacias-wela-default-rtdb.firebaseio.com",
  projectId: "acacias-wela",
  storageBucket: "acacias-wela.firebasestorage.app",
  messagingSenderId: "862398897872",
  appId: "1:862398897872:web:38a16bebd0938c79b288d5",
  measurementId: "G-NJNX1049FF"
};

// Inicialização segura do Firebase
let app;
const apps = firebaseApp.getApps();
if (!apps.length) {
  try {
    app = firebaseApp.initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Erro ao conectar com o Firebase:", error);
    app = {} as any;
  }
} else {
  app = apps[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
// Storage removido para evitar cobranças
export default app;
