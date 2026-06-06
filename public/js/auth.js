// Este arquivo cuida de falar com o nosso "garçom" (o Node.js/Back-end)
// Usamos o comando "fetch" para mandar os dados de login pra lá.

function cadastrar(event) {
    // Isso evita que a página pisque e recarregue quando a gente clica em "Cadastrar"
    event.preventDefault();
    
    // Pegando os valores que a pessoa digitou nas caixinhas de texto
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    
    // Juntamos tudo num pacote só (um objeto JSON) para mandar pro back-end
    var dados = { nome: nome, email: email, senha: senha };

    // Fazemos a chamada pra rota '/api/cadastro' do nosso próprio servidor
    fetch('/api/cadastro', {
        method: 'POST', // POST significa que estamos "enviando" dados novos
        headers: {
            'Content-Type': 'application/json' // Avisando que o formato é JSON
        },
        body: JSON.stringify(dados) // Transforma nosso pacote em texto pra viajar pela internet
    })
    .then(function(resposta) {
        // O servidor respondeu! Vamos abrir a resposta pra ver o que ele disse
        return resposta.json().then(function(json) {
            return { status: resposta.status, body: json };
        });
    })
    .then(function(resultado) {
        // Se o status for 400, é porque deu erro (ex: email já existe)
        if (resultado.status === 400) {
            alert(resultado.body.mensagem); // Mostra o erro que o Node mandou
        } else {
            // Se não, deu certo!
            alert("Cadastro realizado com sucesso! Faça seu login.");
            window.location.href = "login.html"; // Manda o usuário ir fazer login
        }
    })
    .catch(function() {
        // Se o servidor estiver desligado (esqueceu de rodar "node server.js")
        alert("Erro de conexão com o servidor. Verifique se o Node.js está rodando!");
    });
}

function fazerLogin(event) {
    // Evita a página recarregar
    event.preventDefault();
    
    // Pegando email e senha da tela de login
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    var mensagem = document.getElementById('mensagem'); // Caixinha escondida pra erro
    
    var dados = { email: email, senha: senha };

    // Chama o back-end pedindo pra checar a senha
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(function(resposta) {
        return resposta.json().then(function(json) {
            return { status: resposta.status, body: json };
        });
    })
    .then(function(resultado) {
        // Status 200 é o código universal na web pra "Deu tudo certo / OK"
        if (resultado.status === 200) {
            // Salva o NOME na sessão da aba atual, só para a gente lembrar de dizer "Olá fulano!"
            // Nota: Isso é o sessionStorage, ele apaga se fechar a aba
            sessionStorage.setItem('usuarioLogado', resultado.body.nome);
            window.location.href = "index.html"; // Joga pra página principal de clima
        } else {
            // Se errou a senha (cai no else)
            mensagem.className = "alert alert-danger"; // Pinta a caixinha de vermelho
            mensagem.innerHTML = resultado.body.mensagem; // Exibe o erro "Email ou senha incorretos"
            mensagem.classList.remove("d-none"); // Faz a caixinha aparecer
        }
    })
    .catch(function() {
        mensagem.className = "alert alert-danger";
        mensagem.innerHTML = "Erro de conexão com o servidor. O back-end tá ligado?";
        mensagem.classList.remove("d-none");
    });
}

// Essa função roda toda vez que abrimos a página index.html
function verificarLogin() {
    // Checa se tem alguém salvo na sessão da aba
    var usuario = sessionStorage.getItem('usuarioLogado');
    
    if (!usuario) {
        // Se não tem ninguém logado (o cara tentou pular o login), joga ele de volta!
        window.location.href = "login.html";
    } else {
        // Se tá logado, coloca a mensagem de boas vindas e o botão de sair no topo
        var btnSair = document.getElementById('bem-vindo');
        if(btnSair) {
            btnSair.innerHTML = "Olá, " + usuario + "! <button onclick='sair()' class='btn btn-sm btn-danger ms-2'>Sair</button>";
        }
    }
}

// Botão de sair
function sair() {
    sessionStorage.removeItem('usuarioLogado'); // Apaga a memória
    window.location.href = "login.html"; // Volta pro login
}
