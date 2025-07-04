const PI = Math.PI;
const somar = (a, b) => a + b;
const subtrair = (a, b) => a - b;
const multiplicar = (a, b) => a * b;
const dividir = (a, b) => b !== 0 ? a / b : "Erro: Divisão por zero";

export default {
  PI,
  somar,
  subtrair,
  multiplicar,
  dividir
};