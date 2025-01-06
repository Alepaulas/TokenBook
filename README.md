<p align="center">
  <img src="https://raw.githubusercontent.com/avictormorais/token-book/refs/heads/main/src/assets/icon.png" width="150" height="150" alt="Posterfy Logo">
</p>


<h1 align="center">Token Book</h1>


<p align="center">
  <em>Uma biblioteca digital utilizando Ethereum e blockchain para compartilhar livros de forma segura.</em>
</p>

Tokenbook é um acervo digital de livros que usa um ambiente Ethereum proporcionado pelo [hardhat](https://hardhat.org/) em conjunto com contratos inteligentes em Solidity.

O front-end e configurações da blockchain e contratos estão disponíveis no seguinte repositório: [TokenBook front](https://github.com/avictormorais/token-book)

## requisitos:

Uma conta no [pinata](https://pinata.cloud/) para se obter a GATEWAY e a JWT geradas na criação da chave da api

Node.js instalado no sistema

# ⚡Iniciar back-end⚡


**Clone o repositório**
   ```bash
    git clone https://github.com/Alepaulas/OurLibrary.git
   ```

**Acesse a raiz do projeto**
    ```bash
    cd /backend
    ```

**Instale as Dependências**
   ```bash
   npm install
   ```

**Crie o Arquivo `.env`**
   O projeto inclui um arquivo `.env.example` com variáveis de ambiente de exemplo. Para configurar suas próprias variáveis:
   
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - O valor `PINATA_JWT` e `GATEWAY_URL` deve ser o mesmo que foi disponibilizado pelo pinata.

## 🔌Conexão com Hardhat🔌
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

## ▶️Testando Conexão (Opcional)▶️
Se quiser testar a conexão com o nó do Hardhat, você pode rodar o arquivo `backend\config\blockchainConfig.js` da seguinte forma:

```shell
node config\blockchainConfig.js
```
A mensagem Conectado ao nó Hardhat aparecerá (se você seguiu os passos corretamente), sinalizando que esta parte da conexão do backend com o Hardhat está pronta para ser usada.
___
E após isso, basta inicializar as portas com o seguinte comando:
```shell
node index.js
```


## 🔗Front e Back em conjunto🔗
O front-end e o back-end por padrão já estão definidos para usar a porta 3000 para fazer a comunicação, então caso ela já esteja sendo utilizada, é necessário alterá-la no arquivo `/backend/index.js`
```shell
const PORT = process.env.PORT || [insira sua porta aqui] ;
```
E caso os passos tenham sido seguidos corretamente tanto aqui, quanto no [front](https://github.com/avictormorais/token-book), o programa deve funcionar de forma coesa em conjunto.
