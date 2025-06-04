// Serviços para CRUD de Mangás usando Firestore
class MangaService {
    constructor() {
        this.collectionName = 'mangas';
    }

    // CREATE - Adicionar novo mangá
    async addManga(mangaData) {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const mangasCollection = window.collection(window.firebaseDb, this.collectionName);
            const docRef = await window.addDoc(mangasCollection, {
                ...mangaData,
                createdAt: window.serverTimestamp(),
                updatedAt: window.serverTimestamp(),
                views: 0,
                likes: 0
            });
            
            console.log('Mangá adicionado com ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Erro ao adicionar mangá:', error);
            throw error;
        }
    }

    // READ - Buscar todos os mangás
    async getAllMangas() {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const mangasCollection = window.collection(window.firebaseDb, this.collectionName);
            const q = window.query(mangasCollection, window.orderBy('title'));
            const querySnapshot = await window.getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Erro ao buscar mangás:', error);
            throw error;
        }
    }

    // READ - Buscar mangá por ID
    async getMangaById(id) {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const docRef = window.doc(window.firebaseDb, this.collectionName, id);
            const docSnap = await window.getDoc(docRef);
            
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error('Mangá não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar mangá:', error);
            throw error;
        }
    }

    // READ - Buscar mangás por categoria
    async getMangasByCategory(category) {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const mangasCollection = window.collection(window.firebaseDb, this.collectionName);
            const q = window.query(mangasCollection, window.where('category', '==', category));
            const querySnapshot = await window.getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Erro ao buscar mangás por categoria:', error);
            throw error;
        }
    }

    // READ - Buscar mangás em destaque
    async getFeaturedMangas() {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const mangasCollection = window.collection(window.firebaseDb, this.collectionName);
            const q = window.query(
                mangasCollection, 
                window.where('featured', '==', true), 
                window.orderBy('rating', 'desc'),
                window.limit(6)
            );
            const querySnapshot = await window.getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Erro ao buscar mangás em destaque:', error);
            throw error;
        }
    }

    // UPDATE - Atualizar mangá
    async updateManga(id, mangaData) {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const docRef = window.doc(window.firebaseDb, this.collectionName, id);
            await window.updateDoc(docRef, {
                ...mangaData,
                updatedAt: window.serverTimestamp()
            });
            
            console.log('Mangá atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar mangá:', error);
            throw error;
        }
    }

    // DELETE - Deletar mangá
    async deleteManga(id) {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const docRef = window.doc(window.firebaseDb, this.collectionName, id);
            await window.deleteDoc(docRef);
            
            console.log('Mangá deletado com sucesso');
        } catch (error) {
            console.error('Erro ao deletar mangá:', error);
            throw error;
        }
    }

    // Buscar mangás com termo de pesquisa
    async searchMangas(searchTerm) {
        try {
            const allMangas = await this.getAllMangas();
            
            // Filtrar localmente (em produção, use Algolia ou ElasticSearch)
            return allMangas.filter(manga => 
                manga.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manga.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manga.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manga.author?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error('Erro ao buscar mangás:', error);
            throw error;
        }
    }

    // Listener em tempo real para mangás
    subscribeToMangas(callback) {
        try {
            if (!window.firebaseDb) {
                throw new Error('Firebase não inicializado');
            }

            const mangasCollection = window.collection(window.firebaseDb, this.collectionName);
            const q = window.query(mangasCollection, window.orderBy('title'));
            
            return window.onSnapshot(q, (snapshot) => {
                const mangas = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(mangas);
            });
        } catch (error) {
            console.error('Erro ao configurar listener:', error);
            throw error;
        }
    }

    // Incrementar visualizações
    async incrementViews(id) {
        try {
            const manga = await this.getMangaById(id);
            await this.updateManga(id, {
                views: (manga.views || 0) + 1
            });
        } catch (error) {
            console.error('Erro ao incrementar visualizações:', error);
        }
    }

    // Adicionar/remover dos favoritos
    async toggleFavorite(mangaId, userId) {
        try {
            // Implementar lógica de favoritos por usuário
            const favoritesCollection = window.collection(window.firebaseDb, 'favorites');
            const q = window.query(
                favoritesCollection,
                window.where('mangaId', '==', mangaId),
                window.where('userId', '==', userId)
            );
            
            const querySnapshot = await window.getDocs(q);
            
            if (querySnapshot.empty) {
                // Adicionar aos favoritos
                await window.addDoc(favoritesCollection, {
                    mangaId,
                    userId,
                    createdAt: window.serverTimestamp()
                });
                return true; // Favoritado
            } else {
                // Remover dos favoritos
                const doc = querySnapshot.docs[0];
                await window.deleteDoc(window.doc(window.firebaseDb, 'favorites', doc.id));
                return false; // Desfavoritado
            }
        } catch (error) {
            console.error('Erro ao toggle favorite:', error);
            throw error;
        }
    }

    // Buscar favoritos do usuário
    async getUserFavorites(userId) {
        try {
            const favoritesCollection = window.collection(window.firebaseDb, 'favorites');
            const q = window.query(favoritesCollection, window.where('userId', '==', userId));
            const querySnapshot = await window.getDocs(q);
            
            const favoriteIds = querySnapshot.docs.map(doc => doc.data().mangaId);
            
            // Buscar detalhes dos mangás favoritos
            const favoriteMangas = [];
            for (const id of favoriteIds) {
                try {
                    const manga = await this.getMangaById(id);
                    favoriteMangas.push(manga);
                } catch (error) {
                    console.warn(`Mangá ${id} não encontrado`);
                }
            }
            
            return favoriteMangas;
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
            throw error;
        }
    }
}

// Instância global do serviço
window.mangaService = new MangaService();
