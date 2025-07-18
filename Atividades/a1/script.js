// Gerencia o formulário de confirmação de presença no aniversário
document.addEventListener('DOMContentLoaded', () => {
  // Manipula a submissão do formulário
  document.getElementById('aniversario').addEventListener('submit', e => {
    if (!validaFormulario() || !confirmaPresenca()) e.preventDefault();
  });
});

// Coleta os nomes dos adultos ou crianças preenchidos no formulário
function coletaNomes(tipo) {
  return [...document.querySelectorAll(`input[name="${tipo}[]"]`)]
    .map(input => input.value.trim())
    .filter(Boolean);
}

// Valida o formulário para garantir que pelo menos um nome foi preenchido
function validaFormulario() {
  const adultos = coletaNomes('adulto');
  const criancas = coletaNomes('crianca');

  // Verifica se pelo menos um campo foi preenchido
  if (adultos.length === 0 && criancas.length === 0) {
    alert('Você não preencheu os nomes das pessoas que irão no aniversário. Tente novamente!');
    return false;
  }

  return true;
}

// Adiciona um novo campo de adulto ou criança
function addCampo(tipo) {
  const div = document.createElement('div');
  div.className = 'input-group mb-2';
  div.innerHTML = `
    <input type="text" class="form-control" name="${tipo}[]" placeholder="Nome do ${tipo}">
    <button type="button" class="btn btn-outline-danger" onclick="removeCampo(this)">
      Remover
    </button>
  `;
  document.getElementById(`${tipo}s-container`).appendChild(div);
}

// Remove um campo de adulto ou criança
function removeCampo(button) {
  button.parentElement.remove();
}

// Confirma a presença dos adultos e crianças
function confirmaPresenca() {
  const adultos = coletaNomes('adulto');
  const criancas = coletaNomes('crianca');

  let mensagem = '';

  if (adultos.length > 0) mensagem += `Adultos: ${adultos.join(', ')}\n`;
  else mensagem += 'Adulto: Nenhum\n';

  if (criancas.length > 0) mensagem += `Crianças: ${criancas.join(', ')}\n`;
  else mensagem += 'Criança: Nenhuma\n';

  // Pede confirmação do usuário
  if (confirm('Você confirma a presença dos seguintes convidados?\n' + mensagem)) {
    alert('Presença confirmada com sucesso!');
    return true;
  } 

  return false;
}