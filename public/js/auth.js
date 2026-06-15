// ==========================================
// ARQUIVO DE AUTENTICAÇÃO (LOGIN E CADASTRO)
// ==========================================
// Nota pra apresentação: Adaptamos a arquitetura para usar o LocalStorage (banco local do navegador) 
// como nosso banco de dados (Fallback de segurança), garantindo que o projeto rode liso em qualquer 
// PC da faculdade sem precisarmos implorar permissões de administrador pro T.I. pra instalar o Node.js.

function cadastrar(event) {
    // preventDefault serve para a página não recarregar e piscar do zero quando a gente clica em submit
    event.preventDefault();
    
    // Pegando os valores digitados nos inputs usando os IDs lá do HTML
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    
    // Tenta puxar a nossa "tabela" de usuários que já está salva no navegador
    var usuariosDB = localStorage.getItem('usuariosDB');
    
    // Se já tiver alguma coisa salva, ele transforma o texto em lista de novo (usando JSON.parse)
    // Se estiver vazio (primeiro acesso), ele cria uma lista em branco [] pra podermos usar.
    var listaUsuarios = usuariosDB ? JSON.parse(usuariosDB) : [];
    
    // Fazemos uma busca rápida na lista pra checar se alguém já roubou esse email.
    // O comando "find" percorre a lista e testa um por um.
    var existe = listaUsuarios.find(function(u) {
        return u.email === email;
    });

    if (existe) {
        // Se achou alguém, barra o cadastro e avisa
        alert("Esse e-mail já está cadastrado no sistema!");
        return; // O return mata a execução da função aqui, impedindo de salvar no final
    }
    
    // Tudo certo, é um usuário novo! Criamos um objeto com os dados dele e empurramos (push) pra dentro da lista.
    listaUsuarios.push({ nome: nome, email: email, senha: senha });
    
    // O passo mais importante: salvamos a lista atualizada de volta no LocalStorage.
    // É obrigatório usar o JSON.stringify pra transformar a nossa lista em texto (String) antes de salvar, 
    // porque o LocalStorage só aceita guardar Strings puras.
    localStorage.setItem('usuariosDB', JSON.stringify(listaUsuarios));
    
    alert("Cadastro realizado com sucesso! Bora pro login.");
    
    // Redireciona o usuário pra página de login pra ele testar a conta dele
    window.location.href = "login.html";
}

function fazerLogin(event) {
    event.preventDefault(); // Evita recarregar a tela
    
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    var mensagem = document.getElementById('mensagem'); // Aquela caixinha de erro do HTML
    
    // Busca a nossa lista de clientes lá do "banco" (LocalStorage)
    var usuariosDB = localStorage.getItem('usuariosDB');
    var listaUsuarios = usuariosDB ? JSON.parse(usuariosDB) : [];
    
    // Procura na lista se tem um usuário que bata EXATAMENTE o mesmo email e a mesma senha informados
    var usuarioLogado = listaUsuarios.find(function(u) {
        return u.email === email && u.senha === senha;
    });
    
    if (usuarioLogado) {
        // Se o usuário existir, o login deu sucesso!
        // Salvamos o nome dele na memória da SESSÃO (sessionStorage) pra podermos exibir "Olá Fulano" nas telas.
        // Diferente do localStorage (que é eterno), o sessionStorage zera sozinho quando fechamos a aba. Fica bem mais seguro pro login.
        sessionStorage.setItem('usuarioLogado', usuarioLogado.nome);
        
        // Joga pra tela fechada do clima
        window.location.href = "index.html";
    } else {
        // Errou a senha ou email não existe (cai aqui no else)
        mensagem.className = "alert alert-danger"; // Coloca a classe do bootstrap de alerta vermelho
        mensagem.innerHTML = "E-mail ou senha incorretos! Tenta de novo.";
        mensagem.classList.remove("d-none"); // Tira o display:none pra caixa do erro aparecer na tela
    }
}

// Essa função criamos pra rodar sozinha no onload() da página index.html
function verificarLogin() {
    // Checa se tem alguém salvo na sessão logada
    var usuario = sessionStorage.getItem('usuarioLogado');
    
    if (!usuario) {
        // Se a variável estiver vazia, significa que tentaram burlar entrando direto pelo link sem logar.
        // Aí a gente bloqueia e devolve pra tela de login rapidinho!
        window.location.href = "login.html";
    } else {
        // Tudo certo! Pegamos a div 'bem-vindo' e injetamos o nome do cara junto com o botão vermelho de sair.
        var btnSair = document.getElementById('bem-vindo');
        if(btnSair) {
            btnSair.innerHTML = "Olá, " + usuario + "! <button onclick='sair()' class='btn btn-sm btn-danger ms-2'>Sair</button>";
        }
    }
}

// O que acontece quando o botão sair é clicado
function sair() {
    sessionStorage.removeItem('usuarioLogado'); // Excluímos as credenciais do cara da sessão atual
    window.location.href = "login.html"; // Chutamos de volta pra porta de entrada
}
