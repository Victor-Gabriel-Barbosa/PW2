import { 
  auth, 
  db, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  setDoc 
} from '../firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Nome da coleção no Firestore
const USERS_COLLECTION = 'users';

// Registra um novo usuário
export const registerUser = async (email, password, userData) => {
  try {
    // Criar o usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Salvar informações adicionais no Firestore
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      ...userData,
      email: user.email,
      createdAt: new Date()
    });
    
    return user;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

// Faz login do usuário
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// Faz logout do usuário
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

// Obtém o usuário atual
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Obtém dados completos do usuário (incluindo os salvos no Firestore)
export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
};
