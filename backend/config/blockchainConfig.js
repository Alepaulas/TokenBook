import Web3 from "web3";
import { nodeAddress } from "./info.js";

const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress));

web3.eth.net
  .isListening()
  .then(() => console.log("Conectado ao nó Hardhat"))
  .catch((e) => console.log("Algo deu errado", e));

export default web3;
