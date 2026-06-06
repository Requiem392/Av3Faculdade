// Importando as ferramentas que vamos precisar
const express = require('express'); // O "garçom" que vai ouvir os pedidos da internet
const fs = require('fs');           // Ferramenta nativa do Node para ler e escrever arquivos (File System)
const path = require('path');       // Ferramenta para lidar com caminhos de pastas no Windows/Mac/Linux

const app = express(); // Ligando o express
const port = 3000;     // A "porta" do computador onde nosso site vai rodar (localhost:3000)

// Avisando ao Express que ele vai receber dados no formato JSON (que vem do nosso formulário de login)
app.use(express.json());

// Dizendo pro Node: "Libere o acesso à pasta 'public' para os usuários verem o HTML e CSS"
app.use(express.static('public'));

// ---------------------------------------------------------
// ROTA 1: CADASTRO DE USUÁRIOS
// Quando o front-end mandar um POST para '/api/cadastro', esse código roda:
// ---------------------------------------------------------
app.post('/api/cadastro', (req, res) => {
    // req.body tem os dados que o JS do navegador mandou (nome, email, senha)
    const novoUsuario = req.body;
    
    // Caminho exato de onde está o nosso arquivo de "Banco de Dados"
    const bancoDeDados = path.join(__dirname, 'usuarios.json');
    let usuarios = [];
    
    // Tentamos ler o arquivo JSON
    try {
        const dados = fs.readFileSync(bancoDeDados, 'utf8'); // Lê o arquivo como texto
        usuarios = JSON.parse(dados); // Transforma o texto em uma lista (array) do JavaScript
    } catch (erro) {
        // Se der erro (ex: o arquivo ainda não existe), ele ignora e a lista continua vazia []
    }

    // Procura na lista se já tem alguém com o email digitado
    const existe = usuarios.find(u => u.email === novoUsuario.email);
    
    if (existe) {
        // Se existir, devolvemos um erro (Status 400) para o navegador
        return res.status(400).json({ mensagem: "E-mail já cadastrado!" });
    }

    // Se o email for novo, adicionamos o usuário na lista
    usuarios.push(novoUsuario);
    
    // Agora salvamos a lista atualizada de volta no arquivo de texto
    // JSON.stringify transforma a lista em texto de novo para poder salvar
    fs.writeFileSync(bancoDeDados, JSON.stringify(usuarios, null, 2));

    // Avisa o front-end que deu tudo certo!
    res.json({ mensagem: "Cadastro realizado com sucesso!" });
});

// ---------------------------------------------------------
// ROTA 2: FAZER LOGIN
// Quando o front-end mandar um POST para '/api/login', esse código roda:
// ---------------------------------------------------------
app.post('/api/login', (req, res) => {
    // Pega o email e senha que a pessoa digitou na tela
    const loginData = req.body;
    
    const bancoDeDados = path.join(__dirname, 'usuarios.json');
    let usuarios = [];
    
    // Mesma coisa de antes: tenta ler o banco de dados
    try {
        const dados = fs.readFileSync(bancoDeDados, 'utf8');
        usuarios = JSON.parse(dados);
    } catch (erro) {
        // Arquivo não existe ou tá vazio
    }

    // Procura na lista um usuário que tenha EXATAMENTE o mesmo email E a mesma senha
    const usuarioLogado = usuarios.find(u => u.email === loginData.email && u.senha === loginData.senha);

    if (usuarioLogado) {
        // Deu certo! A senha bateu. Devolvemos um aviso de sucesso e o nome do cara pra exibir na tela
        res.json({ sucesso: true, nome: usuarioLogado.nome });
    } else {
        // Se não achou, devolve um erro 401 (Não Autorizado)
        res.status(401).json({ sucesso: false, mensagem: "E-mail ou senha incorretos!" });
    }
});

// ---------------------------------------------------------
// LIGAR O SERVIDOR
// ---------------------------------------------------------
app.listen(port, () => {
    // Quando o servidor ligar com sucesso, mostra isso no terminal escuro
    console.log(`Servidor rodando! Acesse: http://localhost:${port}`);
});
