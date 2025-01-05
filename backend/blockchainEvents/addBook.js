const web3 = require("../config/blockchainConfig.js");
const { contractAddress, userAddress } = require("../config/info.js");
const { abi } = require("../artifacts/contracts/LibAccess.sol/LibAccess.json");

const contract = new web3.eth.Contract(abi, contractAddress);

async function addBook(bookHash, bookOwner) {
  const accounts = await web3.eth.getAccounts();

  const receipt = await contract.methods
    .addBook(bookHash, bookOwner)
    .send({ from: accounts[0] });
  console.log("Livro adicionado com sucesso!");
  receipt.events && console.log("Eventos emitidos:", receipt.events); 
}

module.exports = { addBook};
