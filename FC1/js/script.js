// Calculadora Financeira - JavaScript
// Todas as funcionalidades principais de cálculos financeiros

document.addEventListener('DOMContentLoaded', function () {
  inicializarCalculadora();
});

function inicializarCalculadora() {
  // Event listeners para todos os formulários
  document.getElementById('jurosSimples-form').addEventListener('submit', calcularJurosSimples);
  document.getElementById('jurosCompostos-form').addEventListener('submit', calcularJurosCompostos);
  document.getElementById('financiamento-form').addEventListener('submit', calcularFinanciamento);
  document.getElementById('desconto-form').addEventListener('submit', calcularDesconto);
  document.getElementById('inflacao-form').addEventListener('submit', calcularInflacao);

  // Formatação de campos monetários
  adicionarFormatacaoMonetaria();

  // Validação em tempo real
  adicionarValidacaoTempoReal();
}

// === UTILITÁRIOS ===

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function formatarPorcentagem(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(valor / 100);
}

function formatarNumero(valor) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

function mostrarLoading(elementoId) {
  const elemento = document.getElementById(elementoId);
  elemento.innerHTML = `
        <h5>Calculando...</h5>
        <div class="alert alert-info">
            <span class="loading-spinner"></span>
            Processando os cálculos...
        </div>
    `;
}

function mostrarErro(elementoId, mensagem) {
  const elemento = document.getElementById(elementoId);
  elemento.innerHTML = `
        <h5>Erro:</h5>
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> ${mensagem}
        </div>
    `;
}

// === CALCULADORA DE JUROS SIMPLES ===

function calcularJurosSimples(event) {
  event.preventDefault();

  try {
    mostrarLoading('js-resultado');

    setTimeout(() => {
      const capital = parseFloat(document.getElementById('js-capital').value);
      const taxa = parseFloat(document.getElementById('js-taxa').value);
      const tempo = parseFloat(document.getElementById('js-tempo').value);

      if (capital <= 0 || taxa <= 0 || tempo <= 0) {
        mostrarErro('js-resultado', 'Todos os valores devem ser maiores que zero.');
        return;
      }

      // Fórmula: J = C * i * t
      const juros = capital * (taxa / 100) * tempo;
      const montante = capital + juros;
      const rendimento = (juros / capital) * 100;

      const resultado = `
                <h5>Resultado:</h5>
                <div class="alert alert-success">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Capital Inicial:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(capital)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Juros Obtidos:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(juros)}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Montante Final:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(montante)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Rendimento Total:</strong><br>
                            <span class="valor-monetario">${formatarPorcentagem(rendimento)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <h6>Detalhes do Cálculo:</h6>
                    <div class="alert alert-info">
                        <small>
                            <strong>Fórmula:</strong> J = C × i × t<br>
                            <strong>Onde:</strong> J = Juros, C = Capital, i = Taxa, t = Tempo<br>
                            <strong>Cálculo:</strong> ${formatarMoeda(juros)} = ${formatarMoeda(capital)} × ${taxa}% × ${tempo}
                        </small>
                    </div>
                </div>
            `;

      document.getElementById('js-resultado').innerHTML = resultado;
    }, 500);

  } catch (error) {
    mostrarErro('js-resultado', 'Erro ao processar os dados. Verifique os valores inseridos.');
  }
}

// === CALCULADORA DE JUROS COMPOSTOS ===

function calcularJurosCompostos(event) {
  event.preventDefault();

  try {
    mostrarLoading('jc-resultado');

    setTimeout(() => {
      const capital = parseFloat(document.getElementById('jc-capital').value);
      const taxa = parseFloat(document.getElementById('jc-taxa').value);
      const tempo = parseFloat(document.getElementById('jc-tempo').value);
      const aporte = parseFloat(document.getElementById('jc-aporte').value) || 0;

      if (capital <= 0 || taxa <= 0 || tempo <= 0) {
        mostrarErro('jc-resultado', 'Capital, taxa e tempo devem ser maiores que zero.');
        return;
      }

      // Fórmula: M = C * (1 + i)^t + PMT * [((1 + i)^t - 1) / i]
      const i = taxa / 100;
      const montanteCapital = capital * Math.pow(1 + i, tempo);

      let montanteAportes = 0;
      if (aporte > 0) {
        montanteAportes = aporte * ((Math.pow(1 + i, tempo) - 1) / i);
      }

      const montanteTotal = montanteCapital + montanteAportes;
      const totalInvestido = capital + (aporte * tempo);
      const jurosObtidos = montanteTotal - totalInvestido;
      const rendimentoPercentual = ((montanteTotal / totalInvestido) - 1) * 100;

      // Criar tabela de evolução
      let tabelaEvolucao = '<table class="table table-resultado table-sm mt-3"><thead><tr><th>Período</th><th>Capital</th><th>Aporte</th><th>Juros</th><th>Total</th></tr></thead><tbody>';

      let saldoAtual = capital;
      for (let periodo = 1; periodo <= Math.min(tempo, 12); periodo++) {
        const jurosPeriodo = saldoAtual * i;
        saldoAtual = saldoAtual + jurosPeriodo + aporte;

        tabelaEvolucao += `
                    <tr>
                        <td>${periodo}</td>
                        <td>${formatarMoeda(capital + (aporte * (periodo - 1)))}</td>
                        <td>${formatarMoeda(aporte)}</td>
                        <td>${formatarMoeda(jurosPeriodo)}</td>
                        <td><strong>${formatarMoeda(saldoAtual)}</strong></td>
                    </tr>
                `;
      }

      if (tempo > 12) {
        tabelaEvolucao += `<tr><td colspan="5" class="text-center"><em>... (mostrando apenas os primeiros 12 períodos)</em></td></tr>`;
      }

      tabelaEvolucao += '</tbody></table>';

      const resultado = `
                <h5>Resultado:</h5>
                <div class="alert alert-success">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Capital Inicial:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(capital)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Total de Aportes:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(aporte * tempo)}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Juros Obtidos:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(jurosObtidos)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Montante Final:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(montanteTotal)}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="text-center">
                        <strong>Rendimento Total:</strong><br>
                        <span class="valor-monetario" style="font-size: 1.2rem;">${formatarPorcentagem(rendimentoPercentual)}</span>
                    </div>
                </div>
                
                <div class="mt-3">
                    <h6>Evolução do Investimento:</h6>
                    ${tabelaEvolucao}
                </div>
                
                <div class="mt-3">
                    <h6>Detalhes do Cálculo:</h6>
                    <div class="alert alert-info">
                        <small>
                            <strong>Fórmula:</strong> M = C × (1 + i)^t + PMT × [((1 + i)^t - 1) / i]<br>
                            <strong>Total Investido:</strong> ${formatarMoeda(totalInvestido)}<br>
                            <strong>Juros sobre Juros:</strong> ${formatarMoeda(jurosObtidos)}
                        </small>
                    </div>
                </div>
            `;

      document.getElementById('jc-resultado').innerHTML = resultado;
    }, 800);

  } catch (error) {
    mostrarErro('jc-resultado', 'Erro ao processar os dados. Verifique os valores inseridos.');
  }
}

// === CALCULADORA DE FINANCIAMENTO ===

function calcularFinanciamento(event) {
  event.preventDefault();

  try {
    mostrarLoading('fin-resultado');

    setTimeout(() => {
      const valorBem = parseFloat(document.getElementById('fin-valor').value);
      const entrada = parseFloat(document.getElementById('fin-entrada').value) || 0;
      const taxa = parseFloat(document.getElementById('fin-taxa').value);
      const parcelas = parseInt(document.getElementById('fin-parcelas').value);
      const sistema = document.getElementById('fin-sistema').value;

      if (valorBem <= 0 || taxa <= 0 || parcelas <= 0) {
        mostrarErro('fin-resultado', 'Valor do bem, taxa e número de parcelas devem ser maiores que zero.');
        return;
      }

      if (entrada >= valorBem) {
        mostrarErro('fin-resultado', 'A entrada não pode ser maior ou igual ao valor do bem.');
        return;
      }

      const valorFinanciado = valorBem - entrada;
      const taxaDecimal = taxa / 100;

      let resultado = '';

      if (sistema === 'price') {
        // Sistema Price (Parcelas Fixas)
        const coeficiente = Math.pow(1 + taxaDecimal, parcelas);
        const valorParcela = valorFinanciado * (taxaDecimal * coeficiente) / (coeficiente - 1);
        const valorTotal = valorParcela * parcelas;
        const jurosTotal = valorTotal - valorFinanciado;

        // Tabela de amortização
        let tabela = '<table class="table table-resultado table-sm mt-3"><thead><tr><th>Parcela</th><th>Saldo Devedor</th><th>Amortização</th><th>Juros</th><th>Prestação</th></tr></thead><tbody>';

        let saldoDevedor = valorFinanciado;
        for (let i = 1; i <= Math.min(parcelas, 12); i++) {
          const jurosParcela = saldoDevedor * taxaDecimal;
          const amortizacao = valorParcela - jurosParcela;
          saldoDevedor -= amortizacao;

          tabela += `
                        <tr>
                            <td>${i}</td>
                            <td>${formatarMoeda(saldoDevedor)}</td>
                            <td>${formatarMoeda(amortizacao)}</td>
                            <td>${formatarMoeda(jurosParcela)}</td>
                            <td><strong>${formatarMoeda(valorParcela)}</strong></td>
                        </tr>
                    `;
        }

        if (parcelas > 12) {
          tabela += `<tr><td colspan="5" class="text-center"><em>... (mostrando apenas as primeiras 12 parcelas)</em></td></tr>`;
        }

        tabela += '</tbody></table>';

        resultado = `
                    <h5>Resultado - Sistema Price:</h5>
                    <div class="alert alert-success">
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Valor do Bem:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(valorBem)}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Entrada:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(entrada)}</span>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Valor Financiado:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(valorFinanciado)}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Valor da Parcela:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(valorParcela)}</span>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Total a Pagar:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(valorTotal + entrada)}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Juros Totais:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(jurosTotal)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <h6>Tabela de Amortização (Sistema Price):</h6>
                        ${tabela}
                    </div>
                `;

      } else {
        // Sistema SAC (Amortização Constante)
        const amortizacaoConstante = valorFinanciado / parcelas;
        const primeirasParcelas = [];
        let saldoDevedor = valorFinanciado;
        let jurosTotal = 0;

        // Tabela de amortização SAC
        let tabela = '<table class="table table-resultado table-sm mt-3"><thead><tr><th>Parcela</th><th>Saldo Devedor</th><th>Amortização</th><th>Juros</th><th>Prestação</th></tr></thead><tbody>';

        for (let i = 1; i <= Math.min(parcelas, 12); i++) {
          const jurosParcela = saldoDevedor * taxaDecimal;
          const valorParcela = amortizacaoConstante + jurosParcela;
          jurosTotal += jurosParcela;
          saldoDevedor -= amortizacaoConstante;

          if (i <= 3) {
            primeirasParcelas.push(valorParcela);
          }

          tabela += `
                        <tr>
                            <td>${i}</td>
                            <td>${formatarMoeda(saldoDevedor)}</td>
                            <td>${formatarMoeda(amortizacaoConstante)}</td>
                            <td>${formatarMoeda(jurosParcela)}</td>
                            <td><strong>${formatarMoeda(valorParcela)}</strong></td>
                        </tr>
                    `;
        }

        if (parcelas > 12) {
          tabela += `<tr><td colspan="5" class="text-center"><em>... (mostrando apenas as primeiras 12 parcelas)</em></td></tr>`;

          // Calcular juros total
          saldoDevedor = valorFinanciado;
          jurosTotal = 0;
          for (let i = 1; i <= parcelas; i++) {
            jurosTotal += saldoDevedor * taxaDecimal;
            saldoDevedor -= amortizacaoConstante;
          }
        }

        tabela += '</tbody></table>';

        const valorTotal = valorFinanciado + jurosTotal;
        const ultimaParcela = amortizacaoConstante + (amortizacaoConstante * taxaDecimal);

        resultado = `
                    <h5>Resultado - Sistema SAC:</h5>
                    <div class="alert alert-success">
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Valor do Bem:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(valorBem)}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Entrada:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(entrada)}</span>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Valor Financiado:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(valorFinanciado)}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Amortização Mensal:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(amortizacaoConstante)}</span>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Primeira Parcela:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(primeirasParcelas[0] || 0)}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Última Parcela:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(ultimaParcela)}</span>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-md-6">
                                <strong>Total a Pagar:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(valorTotal + entrada)}</span>
                            </div>
                            <div class="col-md-6">
                                <strong>Juros Totais:</strong><br>
                                <span class="valor-monetario">${formatarMoeda(jurosTotal)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <h6>Tabela de Amortização (Sistema SAC):</h6>
                        ${tabela}
                    </div>
                `;
      }

      document.getElementById('fin-resultado').innerHTML = resultado;
    }, 1000);

  } catch (error) {
    mostrarErro('fin-resultado', 'Erro ao processar os dados. Verifique os valores inseridos.');
  }
}

// === CALCULADORA DE DESCONTO ===

function calcularDesconto(event) {
  event.preventDefault();

  try {
    mostrarLoading('desc-resultado');

    setTimeout(() => {
      const valorOriginal = parseFloat(document.getElementById('desc-valor').value);
      const tipoDesconto = document.getElementById('desc-tipo').value;
      const desconto = parseFloat(document.getElementById('desc-desconto').value);

      if (valorOriginal <= 0 || desconto <= 0) {
        mostrarErro('desc-resultado', 'Valor original e desconto devem ser maiores que zero.');
        return;
      }

      let valorDesconto, valorFinal, percentualDesconto;

      if (tipoDesconto === 'percentual') {
        if (desconto >= 100) {
          mostrarErro('desc-resultado', 'O desconto percentual deve ser menor que 100%.');
          return;
        }
        valorDesconto = valorOriginal * (desconto / 100);
        valorFinal = valorOriginal - valorDesconto;
        percentualDesconto = desconto;
      } else {
        if (desconto >= valorOriginal) {
          mostrarErro('desc-resultado', 'O desconto não pode ser maior ou igual ao valor original.');
          return;
        }
        valorDesconto = desconto;
        valorFinal = valorOriginal - valorDesconto;
        percentualDesconto = (valorDesconto / valorOriginal) * 100;
      }

      const economia = valorDesconto;
      const economiaPercentual = percentualDesconto;

      // Simulações de múltiplos descontos
      const descontos = [5, 10, 15, 20, 25, 30, 40, 50];
      let tabelaSimulacao = '<table class="table table-resultado table-sm mt-3"><thead><tr><th>Desconto</th><th>Valor do Desconto</th><th>Valor Final</th><th>Economia</th></tr></thead><tbody>';

      descontos.forEach(desc => {
        const vDesconto = valorOriginal * (desc / 100);
        const vFinal = valorOriginal - vDesconto;
        tabelaSimulacao += `
                    <tr ${desc === Math.round(percentualDesconto) ? 'class="table-primary"' : ''}>
                        <td>${desc}%</td>
                        <td>${formatarMoeda(vDesconto)}</td>
                        <td>${formatarMoeda(vFinal)}</td>
                        <td>${formatarMoeda(vDesconto)}</td>
                    </tr>
                `;
      });

      tabelaSimulacao += '</tbody></table>';

      const resultado = `
                <h5>Resultado:</h5>
                <div class="alert alert-success">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Valor Original:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(valorOriginal)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Desconto Aplicado:</strong><br>
                            <span class="valor-monetario">${formatarPorcentagem(percentualDesconto)}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Valor do Desconto:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(valorDesconto)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Valor Final:</strong><br>
                            <span class="valor-monetario" style="font-size: 1.2rem;">${formatarMoeda(valorFinal)}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="text-center">
                        <span class="badge badge-lucro badge-custom">
                            Você economiza ${formatarMoeda(economia)} (${formatarPorcentagem(economiaPercentual)})
                        </span>
                    </div>
                </div>
                
                <div class="mt-3">
                    <h6>Simulação de Descontos:</h6>
                    ${tabelaSimulacao}
                    <small class="text-muted">A linha destacada representa o desconto calculado.</small>
                </div>
                
                <div class="mt-3">
                    <h6>Resumo:</h6>
                    <div class="alert alert-info">
                        <small>
                            <strong>Cálculo realizado:</strong> ${tipoDesconto === 'percentual' ? 'Desconto Percentual' : 'Desconto em Valor Fixo'}<br>
                            <strong>Economia total:</strong> ${formatarMoeda(economia)} (${formatarPorcentagem(economiaPercentual)})<br>
                            <strong>Valor a pagar:</strong> ${formatarMoeda(valorFinal)}
                        </small>
                    </div>
                </div>
            `;

      document.getElementById('desc-resultado').innerHTML = resultado;
    }, 600);

  } catch (error) {
    mostrarErro('desc-resultado', 'Erro ao processar os dados. Verifique os valores inseridos.');
  }
}

// === CALCULADORA DE INFLAÇÃO ===

function calcularInflacao(event) {
  event.preventDefault();

  try {
    mostrarLoading('inf-resultado');

    setTimeout(() => {
      const valorInicial = parseFloat(document.getElementById('inf-valor').value);
      const taxaInflacao = parseFloat(document.getElementById('inf-taxa').value);
      const periodo = parseFloat(document.getElementById('inf-tempo').value);

      if (valorInicial <= 0 || taxaInflacao < 0 || periodo <= 0) {
        mostrarErro('inf-resultado', 'Valor inicial e período devem ser maiores que zero. Taxa pode ser zero ou positiva.');
        return;
      }

      // Valor corrigido pela inflação
      const valorCorrigido = valorInicial * Math.pow(1 + (taxaInflacao / 100), periodo);
      const perdaPoder = valorCorrigido - valorInicial;
      const percentualPerda = ((valorCorrigido / valorInicial) - 1) * 100;

      // Valor do dinheiro hoje (poder de compra)
      const poderCompraAtual = valorInicial / Math.pow(1 + (taxaInflacao / 100), periodo);
      const perdaCompra = valorInicial - poderCompraAtual;
      const percentualPerdaCompra = ((valorInicial - poderCompraAtual) / valorInicial) * 100;

      // Tabela de evolução anual
      let tabelaEvolucao = '<table class="table table-resultado table-sm mt-3"><thead><tr><th>Período</th><th>Valor Corrigido</th><th>Poder de Compra</th><th>Perda Acumulada</th></tr></thead><tbody>';

      for (let p = 1; p <= Math.min(periodo, 10); p++) {
        const valorP = valorInicial * Math.pow(1 + (taxaInflacao / 100), p);
        const poderP = valorInicial / Math.pow(1 + (taxaInflacao / 100), p);
        const perdaP = valorInicial - poderP;

        tabelaEvolucao += `
                    <tr>
                        <td>${p}</td>
                        <td>${formatarMoeda(valorP)}</td>
                        <td>${formatarMoeda(poderP)}</td>
                        <td class="valor-negativo">${formatarMoeda(perdaP)}</td>
                    </tr>
                `;
      }

      if (periodo > 10) {
        tabelaEvolucao += `<tr><td colspan="4" class="text-center"><em>... (mostrando apenas os primeiros 10 períodos)</em></td></tr>`;
      }

      tabelaEvolucao += '</tbody></table>';

      // Simulações com diferentes taxas de inflação
      const taxas = [2, 3, 4, 5, 6, 8, 10, 12];
      let tabelaSimulacao = '<table class="table table-resultado table-sm mt-3"><thead><tr><th>Taxa Anual</th><th>Valor Necessário</th><th>Poder de Compra</th><th>Perda</th></tr></thead><tbody>';

      taxas.forEach(taxa => {
        const valorNecessario = valorInicial * Math.pow(1 + (taxa / 100), periodo);
        const poderCompra = valorInicial / Math.pow(1 + (taxa / 100), periodo);
        const perda = valorInicial - poderCompra;
        const isAtual = Math.abs(taxa - taxaInflacao) < 0.1;

        tabelaSimulacao += `
                    <tr ${isAtual ? 'class="table-primary"' : ''}>
                        <td>${taxa}%</td>
                        <td>${formatarMoeda(valorNecessario)}</td>
                        <td>${formatarMoeda(poderCompra)}</td>
                        <td class="valor-negativo">${formatarMoeda(perda)}</td>
                    </tr>
                `;
      });

      tabelaSimulacao += '</tbody></table>';

      const resultado = `
                <h5>Resultado:</h5>
                <div class="alert alert-warning">
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Valor Inicial:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(valorInicial)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Taxa de Inflação:</strong><br>
                            <span class="valor-monetario">${formatarPorcentagem(taxaInflacao)} ao período</span>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-md-6">
                            <strong>Valor Corrigido Necessário:</strong><br>
                            <span class="valor-monetario">${formatarMoeda(valorCorrigido)}</span>
                        </div>
                        <div class="col-md-6">
                            <strong>Poder de Compra Atual:</strong><br>
                            <span class="valor-monetario valor-negativo">${formatarMoeda(poderCompraAtual)}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="text-center">
                        <strong>Perda de Poder de Compra:</strong><br>
                        <span class="valor-negativo" style="font-size: 1.2rem;">
                            ${formatarMoeda(perdaCompra)} (${formatarPorcentagem(percentualPerdaCompra)})
                        </span>
                    </div>
                </div>
                
                <div class="mt-3">
                    <div class="alert alert-info">
                        <h6><i class="bi bi-info-circle"></i> O que isso significa?</h6>
                        <ul class="mb-0">
                            <li>Para manter o mesmo poder de compra, você precisará de <strong>${formatarMoeda(valorCorrigido)}</strong></li>
                            <li>Seus <strong>${formatarMoeda(valorInicial)}</strong> de hoje valerão apenas <strong>${formatarMoeda(poderCompraAtual)}</strong> no futuro</li>
                            <li>A inflação "come" <strong>${formatarMoeda(perdaCompra)}</strong> do seu dinheiro</li>
                        </ul>
                    </div>
                </div>
                
                <div class="mt-3">
                    <h6>Evolução no Tempo:</h6>
                    ${tabelaEvolucao}
                </div>
                
                <div class="mt-3">
                    <h6>Simulação com Diferentes Taxas (${periodo} períodos):</h6>
                    ${tabelaSimulacao}
                    <small class="text-muted">A linha destacada representa a taxa informada.</small>
                </div>
                
                <div class="mt-3">
                    <h6>Detalhes do Cálculo:</h6>
                    <div class="alert alert-info">
                        <small>
                            <strong>Fórmula:</strong> Valor Futuro = Valor Presente × (1 + taxa)^tempo<br>
                            <strong>Inflação acumulada:</strong> ${formatarPorcentagem(percentualPerda)}<br>
                            <strong>Recomendação:</strong> Invista em ativos que rendam pelo menos ${formatarPorcentagem(taxaInflacao)} ao período
                        </small>
                    </div>
                </div>
            `;

      document.getElementById('inf-resultado').innerHTML = resultado;
    }, 700);

  } catch (error) {
    mostrarErro('inf-resultado', 'Erro ao processar os dados. Verifique os valores inseridos.');
  }
}

// === FORMATAÇÃO E VALIDAÇÃO ===

function adicionarFormatacaoMonetaria() {
  // Adiciona formatação automática nos campos monetários
  const camposMonetarios = document.querySelectorAll('input[type="number"]');

  camposMonetarios.forEach(campo => {
    campo.addEventListener('blur', function () {
      if (this.value && this.value > 0) {
        // Remove formatação anterior e aplica nova
        const valor = parseFloat(this.value);
        if (!isNaN(valor)) {
          this.setAttribute('data-original', valor);
        }
      }
    });

    campo.addEventListener('focus', function () {
      // Remove formatação para edição
      const valorOriginal = this.getAttribute('data-original');
      if (valorOriginal) {
        this.value = valorOriginal;
      }
    });
  });
}

function adicionarValidacaoTempoReal() {
  // Validação em tempo real dos formulários
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
      input.addEventListener('input', function () {
        validarCampo(this);
      });

      input.addEventListener('blur', function () {
        validarCampo(this);
      });
    });
  });
}

function validarCampo(campo) {
  const valor = campo.value.trim();
  const tipo = campo.type;
  const isRequired = campo.hasAttribute('required');

  // Remove classes de erro anteriores
  campo.classList.remove('is-invalid');
  const feedbackElement = campo.parentNode.querySelector('.invalid-feedback');
  if (feedbackElement) {
    feedbackElement.remove();
  }

  let isValid = true;
  let mensagemErro = '';

  // Validação de campo obrigatório
  if (isRequired && !valor) {
    isValid = false;
    mensagemErro = 'Este campo é obrigatório.';
  }
  // Validação de números
  else if (tipo === 'number' && valor) {
    const numero = parseFloat(valor);
    if (isNaN(numero)) {
      isValid = false;
      mensagemErro = 'Digite um número válido.';
    } else if (numero < 0) {
      isValid = false;
      mensagemErro = 'O valor deve ser positivo.';
    } else if (campo.id.includes('taxa') && numero > 100) {
      isValid = false;
      mensagemErro = 'Taxa muito alta. Verifique o valor.';
    }
  }

  if (!isValid) {
    campo.classList.add('is-invalid');
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = mensagemErro;
    campo.parentNode.appendChild(feedback);
  }

  return isValid;
}

// === UTILITÁRIOS ADICIONAIS ===

// Função para exportar resultados (futura implementação)
function exportarResultado(tipo) {
  // Implementação futura para exportar em PDF ou Excel
  console.log(`Exportando resultado de ${tipo}...`);
}

// Função para salvar histórico (futura implementação)
function salvarNoHistorico(tipo, dados) {
  // Implementação futura para salvar no localStorage
  const historico = JSON.parse(localStorage.getItem('historicoCalculadora') || '[]');
  historico.push({
    tipo: tipo,
    dados: dados,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('historicoCalculadora', JSON.stringify(historico));
}

// Função para comparar cenários (futura implementação)
function compararCenarios() {
  // Implementação futura para comparar diferentes cenários
  console.log('Comparando cenários...');
}

// Inicialização de tooltips do Bootstrap
document.addEventListener('DOMContentLoaded', function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});