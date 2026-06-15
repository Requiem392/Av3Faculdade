// ==========================================
// ARQUIVO DE AUTENTICAÇÃO (LOGIN E CADASTRO)
// ==========================================
// Nota pra apresentação: A gente mudou a arquitetura pra usar o LocalStorage (banco local do navegador) 
// como nosso banco de dados (Fallback de segurança). Assim o projeto roda de boa em qualquer 
// PC da faculdade sem precisar ficar pedindo permissão de admin pro T.I. pra instalar o Node.js.

function cadastrar(event) {
    // preventDefault não deixa a página recarregar do nada quando clica no botão de submit
    event.preventDefault();
    
    // Pegando as infos que o cara digitou usando os IDs do HTML
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    
    // Tenta puxar a nossa "tabela" de usuários que já tá salva no navegador
    var usuariosDB = localStorage.getItem('usuariosDB');
    
    // Se já tiver alguma coisa, converte o texto pra lista de novo (JSON.parse).
    // Se for o primeiro acesso, cria uma lista zerada [].
    var listaUsuarios = usuariosDB ? JSON.parse(usuariosDB) : [];
    
    // Varre a lista pra ver se alguém já tá usando esse email.
    // O find testa um por um.
    var existe = listaUsuarios.find(function(u) {
        return u.email === email;
    });

    if (existe) {
        // Se achou, trava o cadastro e avisa
        alert("Este e-mail já está cadastrado no sistema.");
        return; // Mata a função aqui pra não salvar duplicado
    }
    
    // Usuário novo! Monta o objeto com os dados dele e joga (push) pra dentro da lista.
    listaUsuarios.push({ nome: nome, email: email, senha: senha });
    
    // A parte principal: salva a lista atualizada no LocalStorage.
    // O JSON.stringify é obrigatório pra converter a lista em texto antes de salvar, 
    // porque o LocalStorage só guarda String.
    localStorage.setItem('usuariosDB', JSON.stringify(listaUsuarios));
    
    alert("Cadastro realizado com sucesso!");
    
    // Manda o usuário pra página de login
    window.location.href = "login.html";
}

function fazerLogin(event) {
    event.preventDefault(); // Trava o recarregamento da tela
    
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    var mensagem = document.getElementById('mensagem'); // Caixinha de erro do HTML
    
    // Puxa a lista de clientes lá do nosso "banco"
    var usuariosDB = localStorage.getItem('usuariosDB');
    var listaUsuarios = usuariosDB ? JSON.parse(usuariosDB) : [];
    
    // Procura na lista se tem alguém com EXATAMENTE o mesmo email e senha informados
    var usuarioLogado = listaUsuarios.find(function(u) {
        return u.email === email && u.senha === senha;
    });
    
    if (usuarioLogado) {
        // Achou! Login deu boa.
        // Salva o nome na memória da SESSÃO (sessionStorage) pra gente poder exibir "Olá Fulano".
        // Diferente do localStorage que fica pra sempre, o sessionStorage zera sozinho quando fecha a aba.
        sessionStorage.setItem('usuarioLogado', usuarioLogado.nome);
        
        // Joga pra tela principal do clima
        window.location.href = "index.html";
    } else {
        // Errou a senha ou não tem o email cadastrado
        mensagem.className = "alert alert-danger"; // Classe de alerta do bootstrap
        mensagem.innerHTML = "E-mail ou senha incorretos! Tenta de novo.";
        mensagem.classList.remove("d-none"); // Tira o display:none pra caixa do erro aparecer
    }
}

// Roda no onload() da página index.html
function verificarLogin() {
    // Vê se tem alguém salvo na sessão logada
    var usuario = sessionStorage.getItem('usuarioLogado');
    
    if (!usuario) {
        // Se tiver vazio, o cara tentou pular o login pelo link.
        // A gente bloqueia e devolve pra tela de login.
        window.location.href = "login.html";
    } else {
        // Tudo certo, injeta o nome do cara junto com o botão de sair.
        var btnSair = document.getElementById('bem-vindo');
        if(btnSair) {
            btnSair.innerHTML = "Olá, " + usuario + "! <button onclick='sair()' class='btn btn-sm btn-danger ms-2'>Sair</button>";
        }
    }
}

// Quando clica em sair
function sair() {
    sessionStorage.removeItem('usuarioLogado'); // Apaga a credencial da sessão
    window.location.href = "login.html"; // Manda pro login
}
