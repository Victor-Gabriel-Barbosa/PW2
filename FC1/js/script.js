// Gerenciamento de Temas
function setTheme(theme) {
  const html = document.documentElement;
  const themeText = document.getElementById('themeText');

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
    themeText.textContent = 'Sistema';
  } else {
    html.setAttribute('data-bs-theme', theme);
    themeText.textContent = theme === 'dark' ? 'Escuro' : 'Claro';
  }

  updateThemeIcon(theme);
  localStorage.setItem('theme', theme);
  updateCharts();
}

// Atualiza o ícone e texto do tema
function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');

  const themeMap = {
    light: { icon: 'bi bi-sun', text: 'Claro' },
    dark: { icon: 'bi bi-moon-stars', text: 'Escuro' },
    auto: { icon: 'bi bi-laptop', text: 'Sistema' }
  };

  themeIcon.className = (themeMap[theme] || { icon: 'bi bi-sun' }).icon;
  themeText.textContent = (themeMap[theme] || { text: 'Tema' }).text;
}

// Carrega tema salvo
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'auto';
  setTheme(savedTheme);
}

// Variáveis globais para os gráficos
let graficoEvolucao = null;
let graficoComposicao = null;

// Função para formatar moeda
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Função para formatar porcentagem
function formatarPorcentagem(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(valor / 100);
}

// Cálculo de Juros Simples
function calcularJurosSimples(capital, taxa, periodo) {
  const juros = capital * (taxa / 100) * periodo;
  const montante = capital + juros;

  return {
    capital,
    taxa,
    periodo,
    juros,
    montante,
    tipo: 'simples'
  };
}

// Cálculo de Juros Compostos
function calcularJurosCompostos(capital, taxa, periodo) {
  const montante = capital * Math.pow(1 + taxa / 100, periodo);
  const juros = montante - capital;

  return {
    capital,
    taxa,
    periodo,
    juros,
    montante,
    tipo: 'compostos'
  };
}

// Cálculo de Desconto Comercial
function calcularDescontoComercial(valorNominal, valorPresente, prazo) {
  const desconto = valorNominal - valorPresente;
  const taxaComercial = (desconto / valorNominal) * (1 / prazo) * 100;
  const taxaEfetiva = (desconto / valorPresente) * (1 / prazo) * 100;
  
  return {
    valorNominal,
    valorPresente,
    desconto,
    prazo,
    taxaComercial,
    taxaEfetiva,
    tipo: 'desconto'
  };
}

// Calcula apenas a taxa comercial
function calcularTaxaComercial(valorNominal, valorPresente, prazo) {
  const desconto = valorNominal - valorPresente;
  const taxaComercial = (desconto / valorNominal) * (1 / prazo) * 100;
  
  return {
    valorNominal,
    valorPresente,
    desconto,
    prazo,
    taxaComercial,
    tipoCalculo: 'comercial',
    tipo: 'desconto'
  };
}

// Calcula apenas a taxa efetiva
function calcularTaxaEfetiva(valorNominal, valorPresente, prazo) {
  const desconto = valorNominal - valorPresente;
  const taxaEfetiva = (desconto / valorPresente) * (1 / prazo) * 100;
  
  return {
    valorNominal,
    valorPresente,
    desconto,
    prazo,
    taxaEfetiva,
    tipoCalculo: 'efetiva',
    tipo: 'desconto'
  };
}

// Exibe resultados
function exibirResultados(resultado) {
  const container = document.getElementById('resultados');
  
  if (resultado.tipo === 'desconto') {
    // Exibir resultados de desconto
    let taxaInfo = '';
    
    if (resultado.tipoCalculo === 'comercial') {
      taxaInfo = `
        <div class="resultado-card fade-in">
          <div class="resultado-label">Taxa de Desconto Comercial (ic)</div>
          <div class="resultado-valor">${formatarPorcentagem(resultado.taxaComercial)} ao período</div>
        </div>
      `;
    } else if (resultado.tipoCalculo === 'efetiva') {
      taxaInfo = `
        <div class="resultado-card fade-in">
          <div class="resultado-label">Taxa Efetiva (i)</div>
          <div class="resultado-valor">${formatarPorcentagem(resultado.taxaEfetiva)} ao período</div>
        </div>
      `;
    } else {
      // Mostrar ambas as taxas
      taxaInfo = `
        <div class="resultado-card fade-in">
          <div class="resultado-label">Taxa de Desconto Comercial (ic)</div>
          <div class="resultado-valor">${formatarPorcentagem(resultado.taxaComercial)} ao período</div>
        </div>
        <div class="resultado-card fade-in">
          <div class="resultado-label">Taxa Efetiva (i)</div>
          <div class="resultado-valor">${formatarPorcentagem(resultado.taxaEfetiva)} ao período</div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="resultado-card fade-in">
        <div class="resultado-label">Valor Nominal</div>
        <div class="resultado-valor">${formatarMoeda(resultado.valorNominal)}</div>
      </div>
      <div class="resultado-card fade-in">
        <div class="resultado-label">Valor Presente</div>
        <div class="resultado-valor">${formatarMoeda(resultado.valorPresente)}</div>
      </div>
      <div class="resultado-card fade-in">
        <div class="resultado-label">Desconto</div>
        <div class="resultado-valor">${formatarMoeda(resultado.desconto)}</div>
      </div>
      ${taxaInfo}
    `;

    // Ocultar seções de gráficos e tabela para desconto
    document.getElementById('graficos-section').style.display = 'none';
    document.getElementById('tabela-section').style.display = 'none';
    return;
  }
  
  // Código existente para juros simples e compostos
  let taxaInfo = '';
  if (resultado.taxaOriginal && resultado.unidadeTaxaOriginal && resultado.taxaEfetiva) {
    const textoUnidadeOriginal = getUnidadeTaxaTexto(resultado.unidadeTaxaOriginal);
    const textoUnidadeEfetiva = getUnidadeTaxaTexto(
      resultado.unidadeOriginal === 'dias' ? 'diaria' :
      resultado.unidadeOriginal === 'anos' ? 'anual' : 'mensal'
    );
    
    if (resultado.taxaOriginal !== resultado.taxaEfetiva) {
      taxaInfo = `
        <div class="resultado-card fade-in">
          <div class="resultado-label">Taxa Original</div>
          <div class="resultado-valor">${formatarPorcentagem(resultado.taxaOriginal)} ${textoUnidadeOriginal}</div>
        </div>
        <div class="resultado-card fade-in">
          <div class="resultado-label">Taxa Convertida</div>
          <div class="resultado-valor">${formatarPorcentagem(resultado.taxaEfetiva)} ${textoUnidadeEfetiva}</div>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div class="resultado-card fade-in">
      <div class="resultado-label">Capital Inicial</div>
      <div class="resultado-valor">${formatarMoeda(resultado.capital)}</div>
    </div>
    ${taxaInfo}
    <div class="resultado-card fade-in">
      <div class="resultado-label">Juros ${resultado.tipo === 'simples' ? 'Simples' : 'Compostos'}</div>
      <div class="resultado-valor">${formatarMoeda(resultado.juros)}</div>
    </div>
    <div class="resultado-card fade-in">
      <div class="resultado-label">Montante Final</div>
      <div class="resultado-valor">${formatarMoeda(resultado.montante)}</div>
    </div>
    <div class="resultado-card fade-in">
      <div class="resultado-label">Rendimento</div>
      <div class="resultado-valor">${formatarPorcentagem((resultado.juros / resultado.capital) * 100)}</div>
    </div>
  `;

  // Mostra seções de gráficos e tabela
  document.getElementById('graficos-section').style.display = 'block';
  document.getElementById('tabela-section').style.display = 'block';

  // Gera gráficos e tabela
  gerarGraficos(resultado);
  gerarTabela(resultado);
}

// Gera dados para evolução
function gerarDadosEvolucao(resultado) {
  const dados = [];
  const { capital, taxa, periodo, tipo } = resultado;

  for (let i = 0; i <= periodo; i++) {
    if (tipo === 'simples') {
      const juros = capital * (taxa / 100) * i;
      dados.push({
        periodo: i,
        capital: capital,
        juros: juros,
        montante: capital + juros
      });
    } else {
      const montante = capital * Math.pow(1 + taxa / 100, i);
      const juros = montante - capital;
      dados.push({
        periodo: i,
        capital: capital,
        juros: juros,
        montante: montante
      });
    }
  }

  return dados;
}

// Gera gráficos
function gerarGraficos(resultado) {
  const dados = gerarDadosEvolucao(resultado);
  const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  const textColor = isDark ? '#ffffff' : '#666666';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  // Gráfico de evolução
  const ctxEvolucao = document.getElementById('grafico-evolucao').getContext('2d');

  if (graficoEvolucao) graficoEvolucao.destroy();

  graficoEvolucao = new Chart(ctxEvolucao, {
    type: 'line',
    data: {
      labels: dados.map(d => `${d.periodo}`),
      datasets: [
        {
          label: 'Capital',
          data: dados.map(d => d.capital),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Montante',
          data: dados.map(d => d.montante),
          borderColor: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Período (meses)',
            color: textColor
          },
          ticks: {
            color: textColor
          },
          grid: {
            color: gridColor
          }
        },
        y: {
          title: {
            display: true,
            text: 'Valor (R$)',
            color: textColor
          },
          ticks: {
            color: textColor,
            callback: function (value) {
              return formatarMoeda(value);
            }
          },
          grid: {
            color: gridColor
          }
        }
      }
    }
  });

  // Gráfico de composição
  const ctxComposicao = document.getElementById('grafico-composicao').getContext('2d');

  if (graficoComposicao) graficoComposicao.destroy();

  graficoComposicao = new Chart(ctxComposicao, {
    type: 'doughnut',
    data: {
      labels: ['Capital Inicial', 'Juros'],
      datasets: [{
        data: [resultado.capital, resultado.juros],
        backgroundColor: ['#6366f1', '#059669'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ': ' + formatarMoeda(context.raw);
            }
          }
        }
      }
    }
  });
}

// Gera tabela de evolução
function gerarTabela(resultado) {
  const dados = gerarDadosEvolucao(resultado);
  const tbody = document.getElementById('tabela-evolucao');

  tbody.innerHTML = dados.map(d => `
    <tr>
      <td>${d.periodo}</td>
      <td>${formatarMoeda(d.capital)}</td>
      <td>${formatarMoeda(d.juros)}</td>
      <td>${formatarMoeda(d.montante)}</td>
    </tr>
  `).join('');
}

// Atualiza gráficos quando o tema muda
function updateCharts() {
  if (graficoEvolucao && graficoComposicao) {
    setTimeout(() => {
      const lastResult = window.lastCalculationResult;
      if (lastResult) gerarGraficos(lastResult);
    }, 100);
  }
}

// Função para converter período para meses
function converterParaMeses(periodo, unidade) {
  const periodos = {
    'dias': (periodo) => periodo / 30,        
    'semanas': (periodo) => periodo / 4.33,  
    'meses': (periodo) => periodo,
    'trimestres': (periodo) => periodo * 3,
    'semestres': (periodo) => periodo * 6,
    'anos': (periodo) => periodo * 12
  };

  return periodos[unidade] ? periodos[unidade](periodo) : periodo;
}

// Função para converter taxa entre diferentes períodos (para juros simples)
function converterTaxaSimples(taxa, unidadeOrigem, unidadeDestino) {
  // Para juros simples, a conversão é proporcional
  const fatoresConversao = {
    'diaria': 1,
    'mensal': 30,
    'anual': 365
  };
  
  // Converte para taxa diária primeiro
  const taxaDiaria = taxa / fatoresConversao[unidadeOrigem];
  
  // Converte da taxa diária para a unidade desejada
  return taxaDiaria * fatoresConversao[unidadeDestino];
}

// Função para atualizar a exibição da taxa convertida
function atualizarTaxaConvertida() {
  const taxaInput = document.getElementById('taxa-simples');
  const unidadeTaxa = document.getElementById('unidade-taxa-simples');
  const periodoUnidade = document.getElementById('unidade-simples');
  const taxaConvertidaSpan = document.getElementById('taxa-convertida-simples');
  
  const taxa = parseFloat(taxaInput.value);
  const unidadeOrigem = unidadeTaxa.value;
  const periodoSelecionado = periodoUnidade.value;
  
  if (!taxa || taxa <= 0) {
    taxaConvertidaSpan.textContent = '-';
    return;
  }
  
  // Mapeia unidades de período para unidades de taxa
  const mapeamentoUnidades = {
    'dias': 'diaria',
    'semanas': 'diaria', // Aproximação
    'meses': 'mensal',
    'trimestres': 'mensal', // Aproximação
    'semestres': 'mensal', // Aproximação
    'anos': 'anual'
  };
  
  const unidadeDestino = mapeamentoUnidades[periodoSelecionado] || 'mensal';
  
  if (unidadeOrigem === unidadeDestino) taxaConvertidaSpan.textContent = `${taxa.toFixed(4)}% ${getUnidadeTaxaTexto(unidadeDestino)}`;
  else {
    const taxaConvertida = converterTaxaSimples(taxa, unidadeOrigem, unidadeDestino);
    taxaConvertidaSpan.textContent = `${taxaConvertida.toFixed(4)}% ${getUnidadeTaxaTexto(unidadeDestino)}`;
  }
}

// Função auxiliar para obter texto da unidade de taxa
function getUnidadeTaxaTexto(unidade) {
  const textos = {
    'diaria': 'ao dia',
    'mensal': 'ao mês',
    'anual': 'ao ano'
  };
  return textos[unidade] || '';
}

// Calcula taxa efetiva para o período selecionado
function calcularTaxaEfetiva(taxa, unidadeTaxa, periodo, unidadePeriodo) {
  // Mapeia unidades de período para unidades de taxa
  const mapeamentoUnidades = {
    'dias': 'diaria',
    'semanas': 'diaria',
    'meses': 'mensal',
    'trimestres': 'mensal',
    'semestres': 'mensal',
    'anos': 'anual'
  };
  
  const unidadeDestino = mapeamentoUnidades[unidadePeriodo] || 'mensal';
  
  if (unidadeTaxa === unidadeDestino) return taxa;
  
  return converterTaxaSimples(taxa, unidadeTaxa, unidadeDestino);
}

// Função para formatar unidade no singular/plural
function formatarUnidade(quantidade, unidade) {
  const unidades = {
    'dias': { singular: 'dia', plural: 'dias' },
    'semanas': { singular: 'semana', plural: 'semanas' },
    'meses': { singular: 'mês', plural: 'meses' },
    'trimestres': { singular: 'trimestre', plural: 'trimestres' },
    'semestres': { singular: 'semestre', plural: 'semestres' },
    'anos': { singular: 'ano', plural: 'anos' }
  };
  
  return quantidade === 1 ? unidades[unidade].singular : unidades[unidade].plural;
}

// Event listener para o formulário de juros simples
document.getElementById('form-simples').addEventListener('submit', function (e) {
  e.preventDefault();

  const capital = parseFloat(document.getElementById('capital-simples').value);
  const taxaOriginal = parseFloat(document.getElementById('taxa-simples').value);
  const unidadeTaxa = document.getElementById('unidade-taxa-simples').value;
  const periodoOriginal = parseInt(document.getElementById('periodo-simples').value);
  const unidade = document.getElementById('unidade-simples').value;

  // Calcula a taxa efetiva para o período selecionado
  const taxaEfetiva = calcularTaxaEfetiva(taxaOriginal, unidadeTaxa, periodoOriginal, unidade);
  const periodo = converterParaMeses(periodoOriginal, unidade);

  const resultado = calcularJurosSimples(capital, taxaEfetiva, periodo);
  resultado.periodoOriginal = periodoOriginal;
  resultado.unidadeOriginal = unidade;
  resultado.taxaOriginal = taxaOriginal;
  resultado.unidadeTaxaOriginal = unidadeTaxa;
  resultado.taxaEfetiva = taxaEfetiva;
  window.lastCalculationResult = resultado;
  exibirResultados(resultado);
});

// Event listener para o formulário de juros compostos
document.getElementById('form-compostos').addEventListener('submit', function (e) {
  e.preventDefault();

  const capital = parseFloat(document.getElementById('capital-compostos').value);
  const taxa = parseFloat(document.getElementById('taxa-compostos').value);
  const periodoOriginal = parseInt(document.getElementById('periodo-compostos').value);
  const unidade = document.getElementById('unidade-compostos').value;

  const periodo = converterParaMeses(periodoOriginal, unidade);

  const resultado = calcularJurosCompostos(capital, taxa, periodo);
  resultado.periodoOriginal = periodoOriginal;
  resultado.unidadeOriginal = unidade;
  window.lastCalculationResult = resultado;
  exibirResultados(resultado);
});

// Event listener para o formulário de desconto comercial
document.getElementById('form-desconto').addEventListener('submit', function (e) {
  e.preventDefault();

  const valorNominal = parseFloat(document.getElementById('valor-nominal').value);
  const valorPresente = parseFloat(document.getElementById('valor-presente').value);
  const prazoOriginal = parseInt(document.getElementById('prazo-desconto').value);
  const unidade = document.getElementById('unidade-desconto').value;
  const tipoCalculo = document.querySelector('input[name="tipo-calculo"]:checked').value;

  // Validar se valor nominal é maior que valor presente
  if (valorNominal <= valorPresente) {
    alert('O valor nominal deve ser maior que o valor presente!');
    return;
  }

  const prazo = converterParaMeses(prazoOriginal, unidade);
  let resultado;

  if (tipoCalculo === 'comercial') resultado = calcularTaxaComercial(valorNominal, valorPresente, prazo);
  else if (tipoCalculo === 'efetiva') resultado = calcularTaxaEfetiva(valorNominal, valorPresente, prazo);
  else resultado = calcularDescontoComercial(valorNominal, valorPresente, prazo);

  resultado.prazoOriginal = prazoOriginal;
  resultado.unidadeOriginal = unidade;
  window.lastCalculationResult = resultado;
  exibirResultados(resultado);
});

// Detecta mudanças no tema do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'auto') setTheme('auto');
});

// Inicializa o tema ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  loadTheme();
  
  // Event listeners para conversão de taxa em tempo real
  const taxaInput = document.getElementById('taxa-simples');
  const unidadeTaxaSelect = document.getElementById('unidade-taxa-simples');
  const unidadePeriodoSelect = document.getElementById('unidade-simples');
  
  // Atualiza taxa convertida quando qualquer campo relevante mudar
  taxaInput.addEventListener('input', atualizarTaxaConvertida);
  unidadeTaxaSelect.addEventListener('change', atualizarTaxaConvertida);
  unidadePeriodoSelect.addEventListener('change', atualizarTaxaConvertida);
  
  // Inicializa a exibição da taxa convertida
  atualizarTaxaConvertida();
});