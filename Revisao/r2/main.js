"use strict";

import mat from './matematica.js';

console.log(mat);

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('PI').innerHTML = `<i class="bi bi-slash-circle"> </i>PI: ${mat.PI}`;

  document.getElementById('calcular').addEventListener('click', () => {
    const valorA = parseFloat(document.getElementById('valorA').value) || 0;
    const valorB = parseFloat(document.getElementById('valorB').value) || 0;

    const operacoes = [
      ['Soma', mat.somar, 'bi-plus-square'],
      ['Subtração', mat.subtrair, 'bi-dash-square'],
      ['Multiplicação', mat.multiplicar, 'bi-x-square'],
      ['Divisão', mat.dividir, 'bi-slash-square']
    ];

    document.getElementById('resultados').innerHTML = operacoes.map(([nome, func, icon]) =>
      `<div class="resultado">
        <i class="bi ${icon}"></i>
        <span>${nome}: ${func(valorA, valorB)}</span>
      </div>`
    ).join('');
  });
}); 