/*  Curso: Análise e Desenvolvimento de Sistemas 
    Aluno: Saulo Torres de Oliveira Assis
    Professora: Tarciana Maria de Sena Katter 
    Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

var urlBase = "http://localhost:8080";

function iniciarSistema() {
    carregarAutores();
    carregarCategorias();
    carregarLivros();
}

function carregarAutores(idSelecionado = null) {
    fetch(urlBase + "/autores")
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            var select = document.getElementById("campoAutor");
            select.innerHTML = '<option value="">Selecione um autor...</option>';
            for (var i = 0; i < dados.length; i++) {
                select.innerHTML += '<option value="' + dados[i].id + '">' + dados[i].nome + '</option>';
            }
            if (idSelecionado) select.value = idSelecionado;
        });
}

function carregarCategorias(idSelecionado = null) {
    fetch(urlBase + "/categorias")
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            var select = document.getElementById("campoCategoria");
            select.innerHTML = '<option value="">Selecione uma categoria...</option>';
            for (var i = 0; i < dados.length; i++) {
                select.innerHTML += '<option value="' + dados[i].id + '">' + dados[i].nome + '</option>';
            }
            if (idSelecionado) select.value = idSelecionado;
        });
}

function carregarLivros() {
    fetch(urlBase + "/livros")
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            var tbody = document.getElementById("tabelaCorpo");
            tbody.innerHTML = "";
            for (var i = 0; i < dados.length; i++) {
                var livro = dados[i];
                var autorNome = (livro.autores && livro.autores.length > 0) ? livro.autores[0].nome : "N/A";
                var categoriaNome = livro.categoria ? livro.categoria.nome : "N/A";
                
                var tr = "<tr>" +
                         "<td>" + livro.id + "</td>" +
                         "<td>" + livro.titulo + "</td>" +
                         "<td>" + autorNome + "</td>" +
                         "<td>" + categoriaNome + "</td>" +
                         "<td>" + livro.situacao + "</td>" +
                         "<td>" +
                            "<div class='acoes-container'>" +
                                "<button class='btn-acao editar' onclick='prepararEdicao(" + livro.id + ")'>Editar</button>" +
                                "<button class='btn-acao excluir' onclick='excluirLivro(" + livro.id + ")'>Excluir</button>" +
                            "</div>" +
                         "</td>" +
                         "</tr>";
                tbody.innerHTML += tr;
            }
        });
}

function resetarErros() {
    document.getElementById("campoTitulo").classList.remove("erro-input");
    document.getElementById("lblTitulo").classList.remove("erro-label");
    document.getElementById("campoAutor").classList.remove("erro-input");
    document.getElementById("lblAutor").classList.remove("erro-label");
    document.getElementById("campoCategoria").classList.remove("erro-input");
    document.getElementById("lblCategoria").classList.remove("erro-label");
}

function salvarLivro() {
    resetarErros();
    var valido = true;

    var titulo = document.getElementById("campoTitulo").value;
    var autorId = document.getElementById("campoAutor").value;
    var categoriaId = document.getElementById("campoCategoria").value;
    var situacao = document.getElementById("campoSituacao").value;
    var idEdicao = document.getElementById("idEdicao").value;

    if (titulo === "") {
        document.getElementById("campoTitulo").classList.add("erro-input");
        document.getElementById("lblTitulo").classList.add("erro-label");
        valido = false;
    }
    if (autorId === "") {
        document.getElementById("campoAutor").classList.add("erro-input");
        document.getElementById("lblAutor").classList.add("erro-label");
        valido = false;
    }
    if (categoriaId === "") {
        document.getElementById("campoCategoria").classList.add("erro-input");
        document.getElementById("lblCategoria").classList.add("erro-label");
        valido = false;
    }

    if (!valido) return;

    var payload = {
        titulo: titulo,
        situacao: situacao,
        categoria: { id: parseInt(categoriaId) },
        autores: [{ id: parseInt(autorId) }]
    };

    var url = urlBase + "/livros";
    var metodo = "POST";

    if (idEdicao !== "") {
        url = urlBase + "/livros/" + idEdicao;
        metodo = "PUT";
    }

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(function(resposta) {
        if (resposta.ok) {
            limparFormulario();
            carregarLivros();
        }
    });
}

function excluirLivro(id) {
    if (confirm("Tem certeza que deseja excluir o livro?")) {
        fetch(urlBase + "/livros/" + id, { method: "DELETE" })
        .then(function(resposta) {
            if (resposta.ok) {
                carregarLivros();
            }
        });
    }
}

function prepararEdicao(id) {
    resetarErros();
    fetch(urlBase + "/livros/" + id)
        .then(function(resposta) { return resposta.json(); })
        .then(function(livro) {
            document.getElementById("idEdicao").value = livro.id;
            document.getElementById("campoTitulo").value = livro.titulo;
            document.getElementById("campoSituacao").value = livro.situacao;
            
            if (livro.categoria) {
                document.getElementById("campoCategoria").value = livro.categoria.id;
            }
            if (livro.autores && livro.autores.length > 0) {
                document.getElementById("campoAutor").value = livro.autores[0].id;
            }
        });
}

function limparFormulario() {
    resetarErros();
    document.getElementById("idEdicao").value = "";
    document.getElementById("campoTitulo").value = "";
    document.getElementById("campoAutor").value = "";
    document.getElementById("campoCategoria").value = "";
    document.getElementById("campoSituacao").value = "Disponível";
    document.getElementById("campoPesquisa").value = "";
    fecharNovoAutor();
    fecharNovaCategoria();
    filtrarTabela();
}

function filtrarTabela() {
    var filtro = document.getElementById("campoPesquisa").value.toUpperCase();
    var tabela = document.getElementById("tabelaCorpo");
    var linhas = tabela.getElementsByTagName("tr");

    for (var i = 0; i < linhas.length; i++) {
        var celulas = linhas[i].getElementsByTagName("td");
        var encontrou = false;
        
        for (var j = 0; j < celulas.length - 1; j++) {
            if (celulas[j]) {
                var textoCelula = celulas[j].textContent || celulas[j].innerText;
                if (textoCelula.toUpperCase().indexOf(filtro) > -1) {
                    encontrou = true;
                    break;
                }
            }
        }
        
        if (encontrou) {
            linhas[i].style.display = "";
        } else {
            linhas[i].style.display = "none";
        }
    }
}

function abrirNovoAutor() { document.getElementById("boxNovoAutor").style.display = "block"; }
function fecharNovoAutor() { 
    document.getElementById("boxNovoAutor").style.display = "none"; 
    document.getElementById("novoAutorNome").value = "";
}
function salvarNovoAutor() {
    var nome = document.getElementById("novoAutorNome").value;
    if (nome === "") return;
    
    fetch(urlBase + "/autores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome })
    })
    .then(function(resposta) { return resposta.json(); })
    .then(function(dados) {
        carregarAutores(dados.id);
        fecharNovoAutor();
    });
}

function abrirNovaCategoria() { document.getElementById("boxNovaCategoria").style.display = "block"; }
function fecharNovaCategoria() { 
    document.getElementById("boxNovaCategoria").style.display = "none"; 
    document.getElementById("novaCategoriaNome").value = "";
}
function salvarNovaCategoria() {
    var nome = document.getElementById("novaCategoriaNome").value;
    if (nome === "") return;
    
    fetch(urlBase + "/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome })
    })
    .then(function(resposta) { return resposta.json(); })
    .then(function(dados) {
        carregarCategorias(dados.id);
        fecharNovaCategoria();
    });
}
