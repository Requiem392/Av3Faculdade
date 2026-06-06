const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Configuração para o express entender JSON que vem do formulário
app.use(express.json());

// Serve a pasta "public" (nossos HTML, CSS e JS) para a internet
app.use(express.static('public'));

// Rota para cadastrar um novo usuário
app.post('/api/cadastro', (req, res) => {
    const novoUsuario = req.body;
    
    // Lê o banco de dados (arquivo JSON)
    const bancoDeDados = path.join(__dirname, 'usuarios.json');
    let usuarios = [];
    
    try {
        const dados = fs.readFileSync(bancoDeDados, 'utf8');
        usuarios = JSON.parse(dados);
    } catch (erro) {
        // Se o arquivo não existir, usa lista vazia
    }

    // Verifica se já existe um usuário com esse email
    const existe = usuarios.find(u => u.email === novoUsuario.email);
    if (existe) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado!" });
    }

    // Adiciona o usuário na lista e salva no arquivo
    usuarios.push(novoUsuario);
    fs.writeFileSync(bancoDeDados, JSON.stringify(usuarios, null, 2));

    res.json({ mensagem: "Cadastro realizado com sucesso!" });
});

// Rota para fazer login
app.post('/api/login', (req, res) => {
    const loginData = req.body;
    
    const bancoDeDados = path.join(__dirname, 'usuarios.json');
    let usuarios = [];
    
    try {
        const dados = fs.readFileSync(bancoDeDados, 'utf8');
        usuarios = JSON.parse(dados);
    } catch (erro) {
        // Arquivo não existe ou vazio
    }

    // Procura o usuário que bate com o email e senha
    const usuarioLogado = usuarios.find(u => u.email === loginData.email && u.senha === loginData.senha);

    if (usuarioLogado) {
        // Retorna só o nome do usuário pra gente mostrar na tela
        res.json({ sucesso: true, nome: usuarioLogado.nome });
    } else {
        res.status(401).json({ sucesso: false, mensagem: "E-mail ou senha incorretos!" });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando! Acesse: http://localhost:${port}`);
});
