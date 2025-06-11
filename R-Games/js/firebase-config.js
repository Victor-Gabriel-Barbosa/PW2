// Configuração do Firebase para "Eu faço você joga!"
// Substitua estas configurações pelas suas credenciais reais do Firebase

const firebaseConfig = {
  apiKey: "AIzaSyCdBAIQtvoVBAn7vyCSrBnQsyz93w09GRY",
  authDomain: "eufacovcjoga.firebaseapp.com",
  projectId: "eufacovcjoga",
  storageBucket: "eufacovcjoga.firebasestorage.app",
  messagingSenderId: "275681503197",
  appId: "1:275681503197:web:e3d4dbe26803b45d0ff834",
  measurementId: "G-WPLF4G1GFB"
};

// Regras de segurança do Firestore (copie para Firebase Console > Firestore > Rules)
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública dos jogos
    match /games/{gameId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Permitir que usuários gerenciem suas próprias avaliações
    match /user_ratings/{ratingId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
`;

// Estrutura exemplo de documento de jogo
export const gameStructure = {
  title: "Nome do Jogo",
  developers: ["Desenvolvedor 1", "Desenvolvedor 2"],
  description: "Descrição detalhada do jogo",
  image: "URL da imagem de capa",
  playUrl: "URL para jogar o jogo",
  videoUrl: "URL do vídeo de gameplay (opcional)",
  category: "Categoria/gênero do jogo",
  ratings: [5, 4, 5, 4, 3], // Array de avaliações individuais
  averageRating: 4.2,
  totalVotes: 5,
  createdAt: new Date(),
  tags: ["tag1", "tag2", "tag3"]
};

// Estrutura exemplo de avaliação de usuário
export const ratingStructure = {
  userId: "ID do usuário que avaliou",
  gameId: "ID do jogo avaliado",
  rating: 5, // Nota de 1 a 5
  createdAt: new Date(),
  updatedAt: new Date()
};
