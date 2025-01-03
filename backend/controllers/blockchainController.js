import { contract } from '../config/blockchainConfig.js';

export const checkAccess = async (req, res) => {
  const { bookHash, userAddress } = req.params;

  try {
    const hasAccess = await contract.methods.hasAccess(bookHash, userAddress).call();
    res.status(200).json({ hasAccess });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar acesso', error });
  }
};

export const addNewBook = async (req, res) => {
  const { bookHash, bookOwner } = req.body;

  try {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addBook(bookHash, bookOwner).send({ from: accounts[0] });
    res.status(201).json({ message: 'Livro adicionado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar livro', error });
  }
};
