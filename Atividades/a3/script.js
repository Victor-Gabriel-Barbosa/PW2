const coords = [10, 20, 30];
const [x, y, z] = coords;
console.log(`x: ${x}, y: ${y}, z: ${z}`);

const rgb = [255, 0, 0];
const [red, , blue] = rgb;
console.log(`Red: ${red}, Blue: ${blue}`);

const pessoa = { nome: 'João', idade: 30, cidade: 'São Paulo' };
const { nome, idade, cidade } = pessoa;
console.log(`Nome: ${nome}, Idade: ${idade}, Cidade: ${cidade}`);

const aluno = { nome: 'Maria', idade: 25, curso: 'Engenharia' };
const { idade: alunoIdade, curso: Engenharia, nome: alunoNome } = aluno;
console.log(`Nome: ${alunoNome}, Idade: ${alunoIdade}, Curso: ${Engenharia}`);

function criarCardAluno({ nome, idade, curso }) {
  return {
    exibir() {
      console.log(`Nome: ${nome}, Idade: ${idade}, Curso: ${curso}`);
    }
  };
}

const card = criarCardAluno({ nome: 'Ana', idade: 22, curso: 'Medicina' });
card.exibir();

const n = [ 1, 2, 3, 4, 5 ];
const [primeiro, segundo, ...resto] = n;
console.log(`Primeiro: ${primeiro}, Segundo: ${segundo}, Resto: [${resto.join(', ')}]`);

function somarTudo(...numeros) {
  return numeros.reduce((total, num) => total + num, 0);
}

const resultado = somarTudo(1, 2, 3, 4, 5);
console.log(`Resultado da soma: ${resultado}`);

const usuario = {
  id: 1,
  nome: 'Carlos',
  idade: 28,
  email: 'teste@ufu.br'
};

const { id, ...infos } = usuario;

console.log(`ID: ${id}`);
console.log(`Informações: ${infos.nome}, ${infos.idade}, ${infos.email}`);