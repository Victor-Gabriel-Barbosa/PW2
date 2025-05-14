import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where 
} from '../firebase-config.js';
import { updateGameRating } from './gameService.js';

// Nome da coleção no Firestore
const RATINGS_COLLECTION = 'ratings';

// Adiciona uma nova avaliação
export const addRating = async (gameId, userId, rating, comment = "") => {
  try {
    // Verifica se o usuário já avaliou este jogo
    const existingRating = await getUserRatingForGame(userId, gameId);
    
    if (existingRating) {
      throw new Error("Você já avaliou este jogo");
    }
    
    // Cria a avaliação
    const ratingData = {
      gameId,
      userId,
      rating,
      comment,
      createdAt: new Date()
    };
    
    // Adiciona a avaliação ao Firestore
    const docRef = await addDoc(collection(db, RATINGS_COLLECTION), ratingData);
    
    // Atualiza a classificação média do jogo
    await updateGameRating(gameId, rating);
    
    return { id: docRef.id, ...ratingData };
  } catch (error) {
    console.error("Erro ao adicionar avaliação:", error);
    throw error;
  }
};

// Obtém todas as avaliações de um jogo
export const getGameRatings = async (gameId) => {
  try {
    const q = query(
      collection(db, RATINGS_COLLECTION),
      where("gameId", "==", gameId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    throw error;
  }
};

// Verifica se um usuário já avaliou um jogo específico
export const getUserRatingForGame = async (userId, gameId) => {
  try {
    const q = query(
      collection(db, RATINGS_COLLECTION),
      where("userId", "==", userId),
      where("gameId", "==", gameId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Retorna a primeira avaliação encontrada
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    console.error("Erro ao verificar avaliação do usuário:", error);
    throw error;
  }
};
