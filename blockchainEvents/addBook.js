import web3 from "../config/blockchainConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { contractAddress, userAddress } from "../config/info.js";

const {
  abi,
} = require("../../artifacts/contracts/LibAccess.sol/LibAccess.json");

const contract = new web3.eth.Contract(abi, contractAddress);

async function addBook(bookHash, bookOwner) {
  const accounts = await web3.eth.getAccounts();

  const receipt = await contract.methods
    .addBook(bookHash, bookOwner)
    .send({ from: accounts[0] });
  console.log("Livro adicionado com sucesso!");
  receipt.events && console.log("Eventos emitidos:", receipt.events); // se o eveto em returnValues for emitido deu tudo certo com a adição do livro, usem isso
}

addBook().catch(console.error);

export { addBook };
