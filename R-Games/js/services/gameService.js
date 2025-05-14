import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  where 
} from '../firebase-config.js';

// Nome da coleção no Firestore
const GAMES_COLLECTION = 'games';

// Adiciona um novo jogo ao Firestore
export const addGame = async (gameData) => {
  try {
    // Adiciona timestamp de criação
    const gameWithTimestamp = {
      ...gameData,
      createdAt: new Date(),
      rating: 0,
      ratingCount: 0
    };
    
    const docRef = await addDoc(collection(db, GAMES_COLLECTION), gameWithTimestamp);
    return { id: docRef.id, ...gameWithTimestamp };
  } catch (error) {
    console.error("Erro ao adicionar jogo:", error);
    throw error;
  }
};

// Obtém todos os jogos
export const getAllGames = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, GAMES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    throw error;
  }
};

// Obtém um jogo específico pelo ID
export const getGameById = async (gameId) => {
  try {
    const docRef = doc(db, GAMES_COLLECTION, gameId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Jogo não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    throw error;
  }
};

// Obtém os jogos melhor avaliados
export const getTopRatedGames = async (count = 5) => {
  try {
    const q = query(
      collection(db, GAMES_COLLECTION),
      orderBy("rating", "desc"),
      limit(count)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar jogos melhor avaliados:", error);
    throw error;
  }
};

// Filtra jogos por categoria
export const getGamesByCategory = async (category) => {
  try {
    const q = query(
      collection(db, GAMES_COLLECTION),
      where("category", "==", category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao filtrar jogos por categoria:", error);
    throw error;
  }
};

// Atualiza a avaliação de um jogo
export const updateGameRating = async (gameId, newRating) => {
  try {
    // Primeiro obtém o jogo atual
    const game = await getGameById(gameId);
    
    // Calcula a nova média de avaliação
    const newRatingCount = game.ratingCount + 1;
    const newAverageRating = ((game.rating * game.ratingCount) + newRating) / newRatingCount;
    
    // Atualiza o documento no Firestore
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    await updateDoc(gameRef, {
      rating: newAverageRating,
      ratingCount: newRatingCount
    });
    
    return { id: gameId, rating: newAverageRating, ratingCount: newRatingCount };
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    throw error;
  }
};
