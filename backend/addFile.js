import ipfs from './config/ipfs.js';

async function addFile() {
  try {
    const fileContent = {
      path: 'hello.txt', // Nome do arquivo
      content: 'Hello, IPFS!', // Conteúdo do arquivo
    };

    const { cid } = await ipfs.add(fileContent);
    console.log('Arquivo adicionado com sucesso!');
    console.log('CID:', cid.toString());
  } catch (error) {
    console.error('Erro ao adicionar o arquivo ao IPFS:', error);
  }
}

addFile();
