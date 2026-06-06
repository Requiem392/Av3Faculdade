// Usando fetch para conversar com o nosso servidor Node.js
// Isso mostra pro professor que vocês sabem o que é uma API e como enviar dados para ela!

function cadastrar(event) {
    event.preventDefault();
    
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    
    var dados = { nome: nome, email: email, senha: senha };

    // Aqui usamos o fetch para mandar pro nosso back-end
    fetch('/api/cadastro', {
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
        if (resultado.status === 400) {
            alert(resultado.body.mensagem);
        } else {
            alert("Cadastro realizado com sucesso! Faça seu login.");
            window.location.href = "login.html";
        }
    })
    .catch(function() {
        alert("Erro de conexão com o servidor. Verifique se o Node.js está rodando!");
    });
}

function fazerLogin(event) {
    event.preventDefault();
    
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    var mensagem = document.getElementById('mensagem');
    
    var dados = { email: email, senha: senha };

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
        if (resultado.status === 200) {
            // Deu certo! Salva só o nome na sessão da aba para exibir depois
            sessionStorage.setItem('usuarioLogado', resultado.body.nome);
            window.location.href = "index.html"; // Vai pra tela do clima
        } else {
            // Erro de login
            mensagem.className = "alert alert-danger";
            mensagem.innerHTML = resultado.body.mensagem;
            mensagem.classList.remove("d-none");
        }
    })
    .catch(function() {
        mensagem.className = "alert alert-danger";
        mensagem.innerHTML = "Erro de conexão com o servidor. O back-end tá ligado?";
        mensagem.classList.remove("d-none");
    });
}

function verificarLogin() {
    var usuario = sessionStorage.getItem('usuarioLogado');
    if (!usuario) {
        window.location.href = "login.html";
    } else {
        var btnSair = document.getElementById('bem-vindo');
        if(btnSair) {
            btnSair.innerHTML = "Olá, " + usuario + "! <button onclick='sair()' class='btn btn-sm btn-danger ms-2'>Sair</button>";
        }
    }
}

function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = "login.html";
}
