const {Web3} = require('web3');
const { nodeAddress } = require('./info.js');

const web3 = new Web3(new Web3.providers.HttpProvider(nodeAddress));

web3.eth.net
  .isListening()
  .then(() => console.log("Conectado ao nó Hardhat"))
  .catch((e) => console.log("Algo deu errado", e));

  module.exports = web3;
