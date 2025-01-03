const hre = require("hardhat");

async function main() {
  console.log("Iniciando o deploy...");

  // Obtém a fábrica do contrato
  const LibAccess = await hre.ethers.getContractFactory("LibAccess");
  console.log("Implantando o contrato...");

  // Realiza o deploy do contrato
  const contract = await LibAccess.deploy();

  // Aguarda o deploy ser concluído
  await contract.deployed();

  // Exibe o endereço do contrato implantado
  console.log("Contrato implantado em:", contract.address);
}

// Lida com erros no deploy
main().catch((error) => {
  console.error("Erro ao implantar o contrato:", error);
  process.exitCode = 1;
});
