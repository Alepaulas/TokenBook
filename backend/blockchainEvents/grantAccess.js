import { contractAddress } from "../config/info.js";
import web3 from "../config/blockchainConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const {
  abi,
} = require("../../artifacts/contracts/LibAccess.sol/LibAccess.json");

const contract = new web3.eth.Contract(abi, contractAddress);

// Exemplo de chamada de função: conceder acesso a um usuário
const bookHash = "teste chote 2";
const userAddress = "0xBcd4042DE499D14e55001CcbB24a551F3b954096"; // Substitua pelo endereço do usuário
const bookOwner = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"; // Substitua pelo endereço do proprietário do livro

async function grantAccess() {
  const accounts = await web3.eth.getAccounts();

  try {
    const receipt = await contract.methods
      .grantAccess(bookHash, userAddress, bookOwner)
      .send({ from: accounts[0] });
    console.log("Acesso concedido com sucesso!");

    receipt.events && console.log("Eventos emitidos:", receipt.events);
  } catch (error) {
    console.error("Erro ao conceder acesso:", error);
  }
}

grantAccess();
