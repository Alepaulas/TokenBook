import web3 from "../config/blockchainConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import {
  contractAddress,
  contractAddress,
  userAddress,
} from "../config/info.js";

const {
  abi,
} = require("../../artifacts/contracts/LibAccess.sol/LibAccess.json");

const contractAddress = contractAddress;

const contract = new web3.eth.Contract(abi, contractAddress);

const bookHash = "teste chote 2"; // colocar aqui o hash do livro
const bookOwner = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"; // endereço do proprietário do livro

async function addBook() {
  const accounts = await web3.eth.getAccounts();

  const receipt = await contract.methods
    .addBook(bookHash, bookOwner)
    .send({ from: accounts[0] });
  console.log("Livro adicionado com sucesso!");
  receipt.events && console.log("Eventos emitidos:", receipt.events); // se o eveto em returnValues for emitido deu tudo certo com a adição do livro, usem isso
}

addBook().catch(console.error);
