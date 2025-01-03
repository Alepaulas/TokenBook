import { contractAddress } from "../config/info.js";
import web3 from "../config/blockchainConfig.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const {
  abi,
} = require("../../artifacts/contracts/LibAccess.sol/LibAccess.json");

const contract = new web3.eth.Contract(abi, contractAddress);

const bookHash = "123";
const userAddress = "0xBcd4042DE499D14e55001CcbB24a551F3b954096"; // Substitua pelo endereço do usuário
const bookOwner = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"; // Substitua pelo endereço do proprietário do livro

async function revokeAccess() {
  const accounts = await web3.eth.getAccounts();

  try {
    const receipt = await contract.methods
      .revokeAccess(bookHash, userAddress, bookOwner)
      .send({ from: accounts[0] });
    console.log("Acesso revogado com sucesso!");

    receipt.events && console.log("Eventos emitidos:", receipt.events);
  } catch (error) {
    console.error("Erro ao revogar acesso:", error);
  }
}

revokeAccess();
