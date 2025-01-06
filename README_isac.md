# Conexão com Hardhat 🔌
Dentro do diretório `\backend`, abra um terminal e execute o comando:

```shell
npx hardhat node
```
Verifique se o nó está rodando no localhost na porta `8545`. Se não estiver, mude o `nodeAddress` em `backend\config\info`.js para a porta onde o nó está rodando.

Após iniciar o nó do Hardhat localmente, ainda dentro de `\backend`, faça o deploy do smart contract `LibAccess.sol` rodando o comando:

```shell
npx hardhat ignition deploy ./ignition/modules/LibAccess.js --network localhost
```
Verifique se o endereço do contrato é `0x5FbDB2315678afecb367f032d93F642f64180aa3`. Se não for, altere o `contractAddress` em `backend\config\info.js` para o endereço correto.

# Testando Conexão (Opcional)▶️
Se quiser testar a conexão com o nó do Hardhat, você pode rodar o arquivo `backend\config\blockchainConfig.js` da seguinte forma:

```shell
node backend\config\blockchainConfig.js
```
A mensagem Conectado ao nó Hardhat aparecerá (se você seguiu os passos corretamente), sinalizando que esta parte da conexão do backend com o Hardhat está pronta para ser usada.