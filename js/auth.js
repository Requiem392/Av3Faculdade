// Usando LocalStorage (LocalDB do navegador) para simular o banco de dados sem precisar de Backend

function cadastrar(event) {
    event.preventDefault(); // Evita que a página recarregue
    
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    
    // Pega os usuários já cadastrados no localdb ou cria lista vazia
    var usuariosDB = localStorage.getItem('usuariosDB');
    var listaUsuarios = usuariosDB ? JSON.parse(usuariosDB) : [];
    
    // Verifica se email já existe
    var existe = listaUsuarios.find(function(u) {
        return u.email === email;
    });

    if(existe) {
        alert("Este e-mail já está cadastrado!");
        return;
    }
    
    // Adiciona o novo usuário
    listaUsuarios.push({ nome: nome, email: email, senha: senha });
    
    // Salva no LocalStorage (nosso "banco local")
    localStorage.setItem('usuariosDB', JSON.stringify(listaUsuarios));
    
    alert("Cadastro realizado com sucesso! Faça seu login.");
    window.location.href = "login.html";
}

function fazerLogin(event) {
    event.preventDefault();
    
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;
    var mensagem = document.getElementById('mensagem');
    
    var usuariosDB = localStorage.getItem('usuariosDB');
    var listaUsuarios = usuariosDB ? JSON.parse(usuariosDB) : [];
    
    // Verifica se encontra o usuário e senha batem
    var usuarioLogado = listaUsuarios.find(function(u) {
        return u.email === email && u.senha === senha;
    });
    
    if (usuarioLogado) {
        // Salva na sessão que o cara logou
        localStorage.setItem('usuarioLogado', usuarioLogado.nome);
        window.location.href = "index.html"; // Vai pro clima
    } else {
        mensagem.className = "alert alert-danger";
        mensagem.innerHTML = "E-mail ou senha incorretos!";
        mensagem.classList.remove("d-none");
    }
}

function verificarLogin() {
    // Essa função é chamada quando a página index.html carrega
    var usuario = localStorage.getItem('usuarioLogado');
    if (!usuario) {
        window.location.href = "login.html"; // Joga de volta pro login se não tiver logado
    } else {
        // Mostra o nome do usuario na tela se houver
        var btnSair = document.getElementById('bem-vindo');
        if(btnSair) {
            btnSair.innerHTML = "Olá, " + usuario + "! <button onclick='sair()' class='btn btn-sm btn-danger ms-2'>Sair</button>";
        }
    }
}

function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login.html";
}
