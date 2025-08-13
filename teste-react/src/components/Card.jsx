import { DotLottieReact } from '@/components';

// Card de exemplo jsx
function Card({ titulo, conteudo }) {
  return (
    <div className="border p-4 rounded">
      <DotLottieReact
        autoplay loop
        src="https://lottie.host/a6f96e82-881d-4061-ae3a-9b91b2e59a5a/9RwkkpqpdW.lottie"
        style={{ width: '300px', height: '300px' }}
      />
      <h2 className="text-xl font-bold">{titulo}</h2>
      <p>{conteudo}</p>
    </div>
  );
}

export default Card;