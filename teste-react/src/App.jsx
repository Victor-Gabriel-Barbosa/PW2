import './App.css'
import { Icons, DotLottieReact } from '@/components';
import Card from '@/components/Card';

function App() {
  return (
    <div>
      <h1>Bem vindo! <Icons.IoLogoOctocat /></h1>
      
      <Card titulo="Gato" conteudo="Este é um exemplo de card com conteúdo sobre gatos." />
    </div>
  )
}

export default App
