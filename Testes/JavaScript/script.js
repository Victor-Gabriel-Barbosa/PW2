const x = true;

if (x) console.log("x é verdadeiro");

const atraso = (tempo) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Atraso concluído"), tempo);
  });
}

await atraso(2000)
  .then((mensagem) => console.log(mensagem))