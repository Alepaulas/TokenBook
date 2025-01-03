import ipfs from "./config/ipfs.js";

async function testConnection() {
  try {
    const id = await ipfs.id();
    console.log("IPFS conectado com sucesso:", id);
  } catch (error) {
    console.error("Erro ao conectar ao IPFS:", error);
  }
}

testConnection();
