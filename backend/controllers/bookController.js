import { InserirLivro } from '../events/EventosLivro.js';
import ipfs from '../config/ipfs.js'; 

export const addBook = async (req, res) => {
  const { titulo, autor, publico, conteudo } = req.body;
  try {
    const { cid } = await ipfs.add(conteudo);

    const novoLivro = {
      id: Date.now(),
      titulo,
      autor,
      publico,
      hash: cid.toString(),
    };

    await InserirLivro(novoLivro);

    res.status(201).json({ message: 'Livro adicionado com sucesso!', livro: novoLivro });
  } catch (error) {
    console.error('Erro ao adicionar livro:', error);
    res.status(500).json({ message: 'Erro ao adicionar livro', error });
  }
};

export const listBooks = async (req, res) => {
    try {
      const queryParams = new URLSearchParams({ status: 'pinned' });
  
      const response = await fetch(
        `https://api.pinata.cloud/data/pinList?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Erro ao buscar os livros na Pinata');
      }
  
      const data = await response.json();
  
      const livros = data.rows.map((file) => ({
        titulo: file.metadata.name,
        cid: file.ipfs_pin_hash,
        tamanho: file.size,
      }));
  
      res.status(200).json({ livros });
    } catch (error) {
      console.error('Erro ao listar livros:', error);
      res.status(500).json({ message: 'Erro ao listar livros', error });
    }
  };
  
