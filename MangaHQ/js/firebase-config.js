// Configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do seu projeto Firebase
// IMPORTANTE: Substitua pelos dados do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpjYTtEPgH-Cw1rAcjeKQYi7V9I2PguYo",
  authDomain: "mangahq-6396a.firebaseapp.com",
  projectId: "mangahq-6396a",
  storageBucket: "mangahq-6396a.firebasestorage.app",
  messagingSenderId: "247396393095",
  appId: "1:247396393095:web:6d8620fe2d7cafebec9822",
  measurementId: "G-JHR49EF3TY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configurar provider do Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Funções de autenticação
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);

export const onAuthStateChangedListener = (callback) => 
  onAuthStateChanged(auth, callback);

// Importar funções do Firestore
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

// Funções CRUD para Mangás
export const mangasCollection = collection(db, 'mangas');

// CREATE - Adicionar novo mangá
export const addManga = async (mangaData) => {
  try {
    const docRef = await addDoc(mangasCollection, {
      ...mangaData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar mangá:', error);
    throw error;
  }
};

// READ - Buscar todos os mangás
export const getAllMangas = async () => {
  try {
    const querySnapshot = await getDocs(query(mangasCollection, orderBy('title')));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar mangás:', error);
    throw error;
  }
};

// READ - Buscar mangá por ID
export const getMangaById = async (id) => {
  try {
    const docRef = doc(db, 'mangas', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Mangá não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar mangá:', error);
    throw error;
  }
};

// READ - Buscar mangás por categoria
export const getMangasByCategory = async (category) => {
  try {
    const q = query(mangasCollection, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar mangás por categoria:', error);
    throw error;
  }
};

// READ - Buscar mangás em destaque
export const getFeaturedMangas = async () => {
  try {
    const q = query(
      mangasCollection, 
      where('featured', '==', true), 
      orderBy('rating', 'desc'),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar mangás em destaque:', error);
    throw error;
  }
};

// UPDATE - Atualizar mangá
export const updateManga = async (id, mangaData) => {
  try {
    const docRef = doc(db, 'mangas', id);
    await updateDoc(docRef, {
      ...mangaData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao atualizar mangá:', error);
    throw error;
  }
};

// DELETE - Deletar mangá
export const deleteManga = async (id) => {
  try {
    const docRef = doc(db, 'mangas', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erro ao deletar mangá:', error);
    throw error;
  }
};

// Listener em tempo real para mangás
export const subscribeToMangas = (callback) => {
  return onSnapshot(query(mangasCollection, orderBy('title')), (snapshot) => {
    const mangas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(mangas);
  });
};

// Buscar mangás com filtros
export const searchMangas = async (searchTerm) => {
  try {
    // Como o Firestore não tem busca full-text nativa, vamos fazer uma busca simples
    const querySnapshot = await getDocs(mangasCollection);
    const allMangas = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrar localmente (em produção, use Algolia ou ElasticSearch)
    return allMangas.filter(manga => 
      manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manga.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manga.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Erro ao buscar mangás:', error);
    throw error;
  }
};

export default app;