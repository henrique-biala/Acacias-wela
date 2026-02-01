
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANTE: Substitua estes valores pelos dados reais do seu Console Firebase
// Se as chaves abaixo forem "YOUR_API_KEY", o app funcionará em modo demonstração/limitado.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

let app: FirebaseApp;

// Verifica se já existe uma instância para evitar erros de re-inicialização
if (!getApps().length) {
  // Se as chaves forem as padrão, o Firebase pode lançar erro. Tratamos aqui:
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase inicializado com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar Firebase. Verifique suas credenciais em firebase.ts", error);
    // Inicialização mínima para evitar tela branca total
    app = {} as FirebaseApp;
  }
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
