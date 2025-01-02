import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://127.0.0.1:8545/")
);

web3.eth.net
  .isListening()
  .then(() => console.log("Conectado ao nó Hardhat"))
  .catch((e) => console.log("Algo deu errado", e));

export default web3;
