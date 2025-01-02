import Web3 from 'web3';
import abi from './LibAccessABI.json';

const web3 = new Web3('substituit pelo URL web3'); 
const contractAddress = 'substituit pelo endereço do contrat';   //

const contract = new web3.eth.Contract(abi, contractAddress);

export { web3, contract };
