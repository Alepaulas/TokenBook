export async function salvarLivroNoBancodeDados(livro) {
    console.log('Salvando livro no banco de dados:', livro);
    return true;
  }
  
  export async function buscarLivros() {
    console.log('Buscando livros no banco de dados...');
    return [
      { id: 1, titulo: 'Livro Exemplo', autor: 'Autor Exemplo', hash: 'abc123' }
    ];
  }
  