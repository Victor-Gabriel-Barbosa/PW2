const media = (valores: number[]) => {
  const soma = valores.reduce((acc, val) => acc + val, 0);
  return soma / valores.length;
}

const cardAluno = (nome: string, idade: number) => {
  return (
    <div>
      <h2>{nome}</h2>
      <p>Idade: {idade}</p>
    </div>
  );
}

const addSobrenome = (nome: string) => {
  return `${nome} da Silva`;
}

export default function Home() {
  return (
    <article>
      <section>
        <div>
          <h1>VictorJS</h1>
          <p>Media: {media([10, 20, 30])}</p>
          {cardAluno("João", 20)}
          {cardAluno("Maria", 22)}
          {cardAluno("Pedro", 19)}
          <p>Nome alterado: {["João", "Maria", "Pedro"].map(addSobrenome).join(", ")}</p>
        </div>
      </section>
    </article>
  );
}