# Projeto Clima Agora ⛅

Este é um projeto acadêmico de faculdade demonstrando uma **Arquitetura Monolítica** focada em simplicidade, utilizando Front-end puro (HTML, CSS, JS, Bootstrap) e Back-end (Node.js com Express e banco de dados local armazenado em um arquivo JSON).

## 🚀 Como rodar o projeto na sua máquina

Se você acabou de baixar os arquivos deste repositório e **já tem o Node.js instalado** no seu computador, siga este passo a passo simples:

### Passo 1: Abrir o Terminal na pasta
Vá até a pasta onde você baixou o projeto (onde está o arquivo `server.js`). 
- No Windows, clique dentro da pasta, digite `cmd` na barra de endereços (lá em cima onde mostra o caminho da pasta) e dê Enter. Isso abrirá o terminal no lugar certo.

### Passo 2: Instalar as dependências do Back-end
Como os arquivos pesados do Node (`node_modules`) não sobem para o GitHub, você precisa pedir para o seu computador baixar o pacote do Express. No terminal, digite:
```bash
npm install
```
*(Aguarde uns segundos. Isso vai baixar tudo que o projeto precisa para rodar e criar a pasta node_modules na sua máquina).*

### Passo 3: Ligar o Servidor
Agora que está tudo instalado, é só rodar o Back-end! No mesmo terminal, digite:
```bash
node server.js
```
*(Se der tudo certo, aparecerá a mensagem: "Servidor rodando! Acesse: http://localhost:3000". Importante: Não feche essa tela preta enquanto estiver usando o site, senão o servidor desliga).*

### Passo 4: Acessar o site
Abra o seu navegador de internet (Chrome, Edge, etc.) e digite:
👉 **http://localhost:3000**

Pronto! Você já pode criar uma conta, fazer o login e testar o consumo da API de clima. Os dados das contas que você criar ficarão salvos no arquivo `usuarios.json` (que simula o nosso banco de dados local).
