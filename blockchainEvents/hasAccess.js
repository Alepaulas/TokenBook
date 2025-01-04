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

const bookHash = "teste chote 2";
const userAddress = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";

async function checkAccess() {
  try {
    const hasAccess = await contract.methods
      .hasAccess(bookHash, userAddress)
      .call();
    console.log(
      `Usuário ${userAddress} tem acesso ao livro ${bookHash}: ${hasAccess}`
    );
  } catch (error) {
    console.error("Erro ao verificar acesso:", error);
  }
}

checkAccess();

export { checkAccess}
