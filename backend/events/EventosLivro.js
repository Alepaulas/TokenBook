const { salvarLivroNoBancodeDados, buscarLivros } = require("../services/livroService");

async function InserirLivro(dados) {
  try {
    console.log("Novo livro inserido na rede IPFS:");
    console.log("ID:", dados.id);
    console.log("Título:", dados.titulo);
    console.log("Autor:", dados.autor);
    console.log("Hash IPFS:", dados.hash);

    await salvarLivroNoBancodeDados({
      id: dados.id,
      titulo: dados.titulo,
      autor: dados.autor,
      hashIPFS: dados.hash,
      publico: dados.publico,
    });
  } catch (error) {
    console.error("Erro ao registrar livro:", error);
  }
}

async function RequisitarLivro(dados) {
  try {
    console.log("Livro requisitado pelo usuário:", dados.usuario);
    console.log("ID do Livro:", dados.id);
  } catch (error) {
    console.error("Erro ao registrar requisição do livro:", error);
  }
}

module.exports = { InserirLivro, RequisitarLivro };