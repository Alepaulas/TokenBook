const web3 = require("../config/blockchainConfig.js");
const { contractAddress, userAddress } = require("../config/info.js");
const { abi } = require("../artifacts/contracts/LibAccess.sol/LibAccess.json");


const contract = new web3.eth.Contract(abi, contractAddress);

async function checkAccess(bookHash, user) {
  console.log(bookHash, user);
  try {
    const hasAccess = await contract.methods
      .hasAccess(bookHash, user)
      .call();
    console.log(
      `Usuário ${user} tem acesso ao livro ${bookHash}: ${hasAccess}`
    );
    return hasAccess;
  } catch (error) {
    console.error("Erro ao verificar acesso:", error);
  }
}


module.exports = { checkAccess };