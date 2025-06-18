// Gerencia o formulário de confirmação de presença no aniversário
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('aniversario');

  // Cria seção para os adultos
  inputAdultos();

  // Cria seção para as crianças
  inputCriancas();

  // Manipula submissão do formulário
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validFormulario()) confirmPresenca();
  });
});

// Valida o formulário para garantir que pelo menos um nome foi preenchido
function validFormulario() {
  const adultos = [];
  const criancas = [];

  // Coleta os nomes dos adultos preenchidos
  const adultosInputs = document.querySelectorAll('input[name="adulto[]"]');
  adultosInputs.forEach(input => {
    if (input.value.trim()) adultos.push(input.value.trim());
  });

  // Coleta os nomes das crianças preenchidos
  const criancasInputs = document.querySelectorAll('input[name="crianca[]"]');
  criancasInputs.forEach(input => {
    if (input.value.trim()) criancas.push(input.value.trim());
  });

  // Verifica se pelo menos um campo foi preenchido
  if (adultos.length === 0 && criancas.length === 0) {
    alert('Por favor, preencha pelo menos um nome (adulto ou criança)!');
    return false;
  }

  return true;
}

// Cria seção para inserir adultos
function inputAdultos() {
  const container = document.getElementById('aniversario');
  const adultosSection = document.createElement('div');
  adultosSection.className = 'mb-4';
  adultosSection.innerHTML = `
    <label class="form-label text-white">Adultos</label>
    <div id="adultos-container"></div>
    <button type="button" class="btn btn-outline-info btn-sm mt-2" onclick="addAdulto()">
      + Adicionar Adulto
    </button>
  `;

  // Insere antes do botão de submit
  const submitBtn = container.querySelector('button[type="submit"]');
  container.insertBefore(adultosSection, submitBtn);
}

// Cria seção para inserir crianças
function inputCriancas() {
  const container = document.getElementById('aniversario');
  const criancasSection = document.createElement('div');
  criancasSection.className = 'mb-4';
  criancasSection.innerHTML = `
    <label class="form-label text-white">Crianças</label>
    <div id="criancas-container"></div>
    <button type="button" class="btn btn-outline-info btn-sm mt-2" onclick="addCrianca()">
      + Adicionar Criança
    </button>
  `;

  // Insere antes do botão de submit
  const submitBtn = container.querySelector('button[type="submit"]');
  container.insertBefore(criancasSection, submitBtn);
}

// Adiciona um campo para inserir o nome de um adulto
function addAdulto() {
  const container = document.getElementById('adultos-container');

  const adultoDiv = document.createElement('div');
  adultoDiv.className = 'input-group mb-2';
  adultoDiv.innerHTML = `
    <input type="text" class="form-control" name="adulto[]" placeholder="Nome do adulto">
    <button type="button" class="btn btn-outline-danger" onclick="removeCampo(this)">
      Remover
    </button>
  `;

  container.appendChild(adultoDiv);
}

// Adiciona um campo para inserir o nome de uma criança
function addCrianca() {
  const container = document.getElementById('criancas-container');

  const criancaDiv = document.createElement('div');
  criancaDiv.className = 'input-group mb-2';
  criancaDiv.innerHTML = `
    <input type="text" class="form-control" name="crianca[]" placeholder="Nome da criança">
    <button type="button" class="btn btn-outline-danger" onclick="removeCampo(this)">
      Remover
    </button>
  `;

  container.appendChild(criancaDiv);
}

// Remove um campo de adulto ou criança
function removeCampo(button) {
  const container = button.parentNode.parentNode;
  const campo = button.parentNode;
  container.removeChild(campo);
}

// Confirma a presença dos adultos e crianças
function confirmPresenca() {
  const adultos = [];
  const criancas = [];

  // Coleta os nomes dos adultos
  const adultosInputs = document.querySelectorAll('input[name="adulto[]"]');
  adultosInputs.forEach(input => {
    if (input.value.trim()) adultos.push(input.value.trim());
  });

  // Coleta os nomes das crianças
  const criancasInputs = document.querySelectorAll('input[name="crianca[]"]');
  criancasInputs.forEach(input => {
    if (input.value.trim()) criancas.push(input.value.trim());
  });

  let mensagem = '';

  if (adultos.length > 0) {
    mensagem += `Adultos (${adultos.length}):\n`;
    adultos.forEach(nome => mensagem += `• ${nome}\n`);
    mensagem += '\n';
  }

  if (criancas.length > 0) {
    mensagem += `Crianças (${criancas.length}):\n`;
    criancas.forEach(nome => mensagem += `• ${nome}\n`);
  }

  // Pede confirmação do usuário
  if (confirm(mensagem + '\nDeseja confirmar?')) {
    alert('Presença confirmada com sucesso!');
    document.getElementById('aniversario').reset();
    document.getElementById('adultos-container').innerHTML = '';
    document.getElementById('criancas-container').innerHTML = '';
  } else alert('Presença não confirmada.');
}