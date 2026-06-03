/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pen, X, BookOpen } from 'lucide-react';
import ChatIA from './ChatIA';
import { useA11y } from './A11yContext';
import Header from './components/Header';
import PlanBadge from './components/PlanBadge';
import ProfileDropdown from './components/ProfileDropdown';
import BookRow from './components/BookRow';

// Função para carregar categorias iniciais ou do localStorage
const obterCategoriasIniciais = () => {
  const mock = [
    { id: 1, nome: 'Estratégia' }, { id: 2, nome: 'Aventura' }, { id: 3, nome: 'Ficção' },
    { id: 4, nome: 'Regionalismo' }, { id: 5, nome: 'Realismo' }, { id: 6, nome: 'Romance' }
  ];
  try {
    let c = JSON.parse(localStorage.getItem('bliobook_categorias'));
    if (!c || c.length === 0) { c = mock; localStorage.setItem('bliobook_categorias', JSON.stringify(c)); }
    return c;
  } catch { return mock; }
};

// Função para carregar autores iniciais ou do localStorage
const obterAutoresIniciais = () => {
  const mock = [
    { id: 1, nome: 'Sun Tzu' }, { id: 2, nome: 'Miguel de Cervantes' }, { id: 3, nome: 'John Bunyan' },
    { id: 4, nome: 'Graciliano Ramos' }, { id: 5, nome: 'Machado de Assis' }
  ];
  try {
    let a = JSON.parse(localStorage.getItem('bliobook_autores'));
    if (!a || a.length === 0) { a = mock; localStorage.setItem('bliobook_autores', JSON.stringify(a)); }
    return a;
  } catch { return mock; }
};

// Função para carregar livros iniciais ou do localStorage
const obterLivrosIniciais = () => {
  const mock = [
    { id: 1, titulo: 'A Arte da Guerra', autores: [{ nome: 'Sun Tzu' }], categoria: { nome: 'Estratégia' }, situacao: 'Não Disponível' },
    { id: 2, titulo: 'Dom Quixote', autores: [{ nome: 'Miguel de Cervantes' }], categoria: { nome: 'Aventura' }, situacao: 'Emprestado' },
    { id: 3, titulo: 'O Peregrino', autores: [{ nome: 'John Bunyan' }], categoria: { nome: 'Ficção' }, situacao: 'Disponível' },
    { id: 4, titulo: 'Vidas Secas', autores: [{ nome: 'Graciliano Ramos' }], categoria: { nome: 'Regionalismo' }, situacao: 'Não Disponível' },
    { id: 5, titulo: 'Memórias Póstumas de Brás Cubas', autores: [{ nome: 'Machado de Assis' }], categoria: { nome: 'Realismo' }, situacao: 'Disponível' },
    { id: 6, titulo: 'Dom Casmurro', autores: [{ nome: 'Machado de Assis' }], categoria: { nome: 'Romance' }, situacao: 'Emprestado' }
  ];
  try {
    let l = JSON.parse(localStorage.getItem('bliobook_livros'));
    if (!l || l.length === 0) { l = mock; localStorage.setItem('bliobook_livros', JSON.stringify(l)); }
    return l;
  } catch { return mock; }
};

const Dashboard = ({ onSair, onPerfil, onPlanos }) => {
  // Estados para listas de dados
  const [livros, setLivros] = useState(obterLivrosIniciais);
  const [autores, setAutores] = useState(obterAutoresIniciais);
  const [categorias, setCategorias] = useState(obterCategoriasIniciais);
  const [pesquisa, setPesquisa] = useState("");

  // Estado para inicial avatar do usuário
  const [inicialAvatar] = useState(() => {
    const nome = localStorage.getItem('bliobook_user_nome');
    return nome && nome.trim() !== "" ? nome.trim().charAt(0).toUpperCase() : "U";
  });
  // Estado para plano atual do usuário
  const [planoAtual] = useState(() =>
    localStorage.getItem('bliobook_plano') || 'Free'
  );

  const { highContrast } = useA11y();
  // Estado para formulário de livro
  const [formLivro, setFormLivro] = useState({ id: "", titulo: "", autorNome: "", categoriaNome: "", situacao: "Disponível" });

  // Callback para carregar dados do localStorage
  const carregarDados = useCallback(() => {
    try {
      const l = JSON.parse(localStorage.getItem('bliobook_livros')) || [];
      const a = JSON.parse(localStorage.getItem('bliobook_autores')) || [];
      const c = JSON.parse(localStorage.getItem('bliobook_categorias')) || [];
      setLivros(l);
      setAutores(a);
      setCategorias(c);
    } catch {
      // Barreira de proteção contra leituras corrompidas pós-montagem
    }
  }, []);

  // Efeito para ouvir eventos de atualização do acervo
  useEffect(() => {
    const listener = () => carregarDados();
    window.addEventListener('atualizarAcervoEvent', listener);
    return () => window.removeEventListener('atualizarAcervoEvent', listener);
  }, [carregarDados]);

  // Função para salvar livro (criar ou editar)
  const salvarLivro = () => {
    if (!formLivro.titulo || !formLivro.autorNome || !formLivro.categoriaNome) return alert("Preencha o título, autor e categoria!");

    let novaListaLivros = [...livros];
    let novaListaAutores = [...autores];
    let novaListaCategorias = [...categorias];

    // Verifica e cria autor se não existir
    const autorExiste = novaListaAutores.find(a => a.nome.toLowerCase() === formLivro.autorNome.toLowerCase());
    if (!autorExiste) {
      const novoIdAutor = novaListaAutores.length > 0 ? Math.max(...novaListaAutores.map(a => a.id)) + 1 : 1;
      novaListaAutores.push({ id: novoIdAutor, nome: formLivro.autorNome });
      localStorage.setItem('bliobook_autores', JSON.stringify(novaListaAutores));
    }

    // Verifica e cria categoria se não existir
    const catExiste = novaListaCategorias.find(c => c.nome.toLowerCase() === formLivro.categoriaNome.toLowerCase());
    if (!catExiste) {
      const novoIdCat = novaListaCategorias.length > 0 ? Math.max(...novaListaCategorias.map(c => c.id)) + 1 : 1;
      novaListaCategorias.push({ id: novoIdCat, nome: formLivro.categoriaNome });
      localStorage.setItem('bliobook_categorias', JSON.stringify(novaListaCategorias));
    }

    // Atualiza ou cria livro
    if (formLivro.id) {
      novaListaLivros = novaListaLivros.map(l => l.id === formLivro.id ? {
        ...l, titulo: formLivro.titulo, situacao: formLivro.situacao,
        autores: [{ nome: formLivro.autorNome }], categoria: { nome: formLivro.categoriaNome }
      } : l);
    } else {
      const novoIdLivro = novaListaLivros.length > 0 ? Math.max(...novaListaLivros.map(l => l.id)) + 1 : 1;
      novaListaLivros.push({
        id: novoIdLivro, titulo: formLivro.titulo, situacao: formLivro.situacao,
        autores: [{ nome: formLivro.autorNome }], categoria: { nome: formLivro.categoriaNome }
      });
    }

    localStorage.setItem('bliobook_livros', JSON.stringify(novaListaLivros));
    setFormLivro({ id: "", titulo: "", autorNome: "", categoriaNome: "", situacao: "Disponível" });
    carregarDados();
  };

  // Função para excluir livro
  const excluirLivro = (id) => {
    // Para automação CI/CD do Playwright não falhar por bloqueio de prompt,
    // o confirm natural do window é suprimido na camada de teste e interceptado pela API do Playwright.
    if (window.confirm("Confirma a exclusão desta obra?")) {
      const novaLista = livros.filter(l => l.id !== id);
      localStorage.setItem('bliobook_livros', JSON.stringify(novaLista));
      carregarDados();
    }
  };

  // Prepara formulário para edição
  const prepararEdicaoLivro = (livro) => {
    setFormLivro({ id: livro.id, titulo: livro.titulo, autorNome: livro.autores?.[0]?.nome || "", categoriaNome: livro.categoria?.nome || "", situacao: livro.situacao });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Adiciona autor via prompt
  const adicionarAutorInline = () => {
    const novoNome = window.prompt("Adicionar novo Autor. Digite o nome:");
    if (novoNome && novoNome.trim() !== "") {
      const nomeFormatado = novoNome.trim();
      const duplicado = autores.some(a => a.nome.toLowerCase() === nomeFormatado.toLowerCase());
      if (duplicado) return alert("Ação Bloqueada: Este autor já está cadastrado no acervo.");

      const novaLista = [...autores];
      const novoId = novaLista.length > 0 ? Math.max(...novaLista.map(a => a.id)) + 1 : 1;
      novaLista.push({ id: novoId, nome: nomeFormatado });
      localStorage.setItem('bliobook_autores', JSON.stringify(novaLista));

      setFormLivro({...formLivro, autorNome: nomeFormatado});
      carregarDados();
    }
  };

  // Edita autor via prompt
  const editarAutorInline = () => {
    const autor = autores.find(a => a.nome.toLowerCase() === formLivro.autorNome.trim().toLowerCase());
    if (!autor) return alert("Para editar, digite o nome de um autor que já existe no banco de dados.");
    const novoNome = window.prompt("Editar nome do autor:", autor.nome);
    if (novoNome && novoNome.trim() !== "" && novoNome !== autor.nome) {
      const duplicado = autores.some(a => a.nome.toLowerCase() === novoNome.trim().toLowerCase());
      if (duplicado) return alert("Ação Bloqueada: Já existe outro autor com este nome.");

      const novaLista = autores.map(a => a.id === autor.id ? { ...a, nome: novoNome.trim() } : a);
      localStorage.setItem('bliobook_autores', JSON.stringify(novaLista));

      let novaListaLivros = [...livros].map(l => {
          if(l.autores?.[0]?.nome === autor.nome) {
              return {...l, autores: [{nome: novoNome.trim()}]};
          }
          return l;
      });
      localStorage.setItem('bliobook_livros', JSON.stringify(novaListaLivros));

      setFormLivro({...formLivro, autorNome: novoNome.trim()});
      carregarDados();
    }
  };

  // Exclui autor se não tiver vínculos
  const excluirAutorInline = () => {
    const autor = autores.find(a => a.nome.toLowerCase() === formLivro.autorNome.trim().toLowerCase());
    if (!autor) return alert("Autor não localizado.");
    const vinculado = livros.some(l => l.autores?.[0]?.nome === autor.nome);
    if (vinculado) return alert(`Ação Bloqueada: Não é possível remover o autor '${autor.nome}'. Ele possui livros cadastrados.`);
    if (window.confirm(`Excluir o autor '${autor.nome}' do banco de dados?`)) {
      const novaLista = autores.filter(a => a.id !== autor.id);
      localStorage.setItem('bliobook_autores', JSON.stringify(novaLista));
      setFormLivro({...formLivro, autorNome: ""});
      carregarDados();
    }
  };

  // Adiciona categoria via prompt
  const adicionarCategoriaInline = () => {
    const novoNome = window.prompt("Adicionar nova Categoria. Digite o nome:");
    if (novoNome && novoNome.trim() !== "") {
      const nomeFormatado = novoNome.trim();
      const duplicado = categorias.some(c => c.nome.toLowerCase() === nomeFormatado.toLowerCase());
      if (duplicado) return alert("Ação Bloqueada: Esta categoria já está cadastrada no acervo.");

      const novaLista = [...categorias];
      const novoId = novaLista.length > 0 ? Math.max(...novaLista.map(c => c.id)) + 1 : 1;
      novaLista.push({ id: novoId, nome: nomeFormatado });
      localStorage.setItem('bliobook_categorias', JSON.stringify(novaLista));

      setFormLivro({...formLivro, categoriaNome: nomeFormatado});
      carregarDados();
    }
  };

  // Edita categoria via prompt
  const editarCategoriaInline = () => {
    const cat = categorias.find(c => c.nome.toLowerCase() === formLivro.categoriaNome.trim().toLowerCase());
    if (!cat) return alert("Para editar, digite o nome de uma categoria que já existe no banco.");
    const novoNome = window.prompt("Editar nome da categoria:", cat.nome);
    if (novoNome && novoNome.trim() !== "" && novoNome !== cat.nome) {
      const duplicado = categorias.some(c => c.nome.toLowerCase() === novoNome.trim().toLowerCase());
      if (duplicado) return alert("Ação Bloqueada: Já existe outra categoria com este nome.");

      const novaLista = categorias.map(c => c.id === cat.id ? { ...c, nome: novoNome.trim() } : c);
      localStorage.setItem('bliobook_categorias', JSON.stringify(novaLista));

      let novaListaLivros = [...livros].map(l => {
          if(l.categoria?.nome === cat.nome) {
              return {...l, categoria: {nome: novoNome.trim()}};
          }
          return l;
      });
      localStorage.setItem('bliobook_livros', JSON.stringify(novaListaLivros));

      setFormLivro({...formLivro, categoriaNome: novoNome.trim()});
      carregarDados();
    }
  };

  // Exclui categoria se não tiver vínculos
  const excluirCategoriaInline = () => {
    const cat = categorias.find(c => c.nome.toLowerCase() === formLivro.categoriaNome.trim().toLowerCase());
    if (!cat) return alert("Categoria não localizada.");
    const vinculado = livros.some(l => l.categoria?.nome === cat.nome);
    if (vinculado) return alert(`Ação Bloqueada: Não é possível remover a categoria '${cat.nome}'. Ela possui livros vinculados.`);
    if (window.confirm(`Excluir a categoria '${cat.nome}' do banco de dados?`)) {
      const novaLista = categorias.filter(c => c.id !== cat.id);
      localStorage.setItem('bliobook_categorias', JSON.stringify(novaLista));
      setFormLivro({...formLivro, categoriaNome: ""});
      carregarDados();
    }
  };

  // Verifica se é plano premium
  const isPremium = planoAtual !== "Free";
  // Define classe de borda baseada no contraste e plano
  const sectionBorderClass = highContrast || isPremium ? "border-primary" : "border-transparent";

  return (
    <main className="container py-10 relative">

      <PlanBadge isPremium={isPremium} planoAtual={planoAtual} highContrast={highContrast} onPlanos={onPlanos} />

      <ProfileDropdown inicialAvatar={inicialAvatar} onPerfil={onPerfil} onSair={onSair} />

      <Header />

      {/* Seção de formulário de cadastro/edição */}
      <section className={`p-[30px] bg-cardBg rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)] mb-[30px] border-t-4 ${sectionBorderClass}`}>
        <h3 className="text-primary mt-0 text-2xl">
          {formLivro.id ? "Editando Registro: " + formLivro.titulo : "Novo Cadastro Transacional"}
        </h3>

        <label className="font-bold block mt-5 mb-2 text-textColor">Título da Obra: *</label>
        <input
          className="input-field p-3 w-full box-border"
          aria-label="Campo de texto para preencher o título da obra bibliográfica"
          title="Digite o título do livro"
          data-testid="input-titulo" /* Alvo de Automacao: Campo de Titulo */
          value={formLivro.titulo} onChange={e => setFormLivro({...formLivro, titulo: e.target.value})} placeholder="Título da Obra..."
        />

        <div className="flex gap-5 flex-wrap mt-5">
          <div className="flex-1 min-w-[280px]">
            <label className="font-bold block mb-2 text-textColor">Autor: *</label>
            <div className="flex gap-2">
              <input
                className="input-field flex-1 p-3"
                aria-label="Campo de texto e seleção para o nome do autor da obra"
                title="Selecione ou digite um autor"
                data-testid="input-autor" /* Alvo de Automacao: Campo de Autor */
                value={formLivro.autorNome} onChange={e => setFormLivro({...formLivro, autorNome: e.target.value})} list="lista-autores" autoComplete="off" placeholder="Nome do autor..."
              />
              <button type="button" onClick={adicionarAutorInline}
                className="btn-salvar bg-primary text-btnText border-none px-3 py-2 rounded-lg font-bold cursor-pointer" aria-label="Criar novo autor" title="Adicionar Autor">
                <Plus size={18}/>
              </button>
              <button type="button" onClick={editarAutorInline} 
                className="btn-cancelar px-3 py-2 rounded-lg font-bold cursor-pointer" aria-label="Editar nome do autor selecionado" title="Editar Autor">
                <Pen size={18}/>
              </button>
              <button type="button" onClick={excluirAutorInline} 
                className="btn-excluir px-3 py-2 rounded-lg font-bold cursor-pointer" aria-label="Excluir o autor selecionado" title="Excluir Autor">
                <X size={18}/>
              </button>
            </div>
            <datalist id="lista-autores">{autores.map(a => <option key={a.id} value={a.nome} />)}</datalist>
          </div>

          <div className="flex-1 min-w-[280px]">
            <label className="font-bold block mb-2 text-textColor">Categoria: *</label>
            <div className="flex gap-2">
              <input
                className="input-field flex-1 p-3"
                aria-label="Campo de texto e seleção para a categoria da obra"
                title="Selecione ou digite uma categoria"
                data-testid="input-categoria" /* Alvo de Automacao: Campo de Categoria */
                value={formLivro.categoriaNome} onChange={e => setFormLivro({...formLivro, categoriaNome: e.target.value})} list="lista-categorias" autoComplete="off" placeholder="Nome da categoria..."
              />
              <button type="button" onClick={adicionarCategoriaInline} 
                className="btn-salvar bg-primary text-btnText border-none px-3 py-2 rounded-lg font-bold cursor-pointer" aria-label="Criar nova categoria" title="Adicionar Categoria">
                <Plus size={18}/>
              </button>
              <button type="button" onClick={editarCategoriaInline} 
                className="btn-cancelar px-3 py-2 rounded-lg font-bold cursor-pointer" aria-label="Editar nome da categoria selecionado" title="Editar Categoria">
                <Pen size={18}/>
              </button>
              <button type="button" onClick={excluirCategoriaInline} 
                className="btn-excluir px-3 py-2 rounded-lg font-bold cursor-pointer" aria-label="Excluir a categoria selecionada" title="Excluir Categoria">
                <X size={18}/>
              </button>
            </div>
            <datalist id="lista-categorias">{categorias.map(c => <option key={c.id} value={c.nome} />)}</datalist>
          </div>
        </div>

        <label className="font-bold block mt-5 mb-2 text-textColor">Situação Atual:</label>
        <select
          className="input-field p-3 w-full box-border"
          aria-label="Caixa de seleção para definir o status de disponibilidade do livro"
          title="Selecione a situação da obra"
          value={formLivro.situacao} onChange={e => setFormLivro({...formLivro, situacao: e.target.value})}
        >
          <option value="Disponível">Disponível</option>
          <option value="Emprestado">Emprestado</option>
          <option value="Não Disponível">Não Disponível</option>
        </select>

        <div className="flex gap-4 mt-6">
          <button className="btn-salvar flex-1 p-[15px] text-[1.1rem] font-bold bg-primary text-btnText border-none rounded-lg cursor-pointer" 
            data-testid="btn-salvar-livro" /* Alvo de Automacao: Botao Salvar */
            onClick={salvarLivro} aria-label="Botão para confirmar e salvar o livro">
            Salvar Livro
          </button>
          <button className="btn-excluir flex-1 p-[15px] text-[1.1rem] font-bold rounded-lg cursor-pointer" 
            onClick={() => setFormLivro({ id: "", titulo: "", autorNome: "", categoriaNome: "", situacao: "Disponível" })} aria-label="Botão para limpar todos os campos do formulário">
            Limpar
          </button>
        </div>
      </section>

      {/* Seção de listagem do acervo */}
      <section className="p-[30px] bg-cardBg rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
        <h3 className="text-primary mt-0 text-2xl mb-5 flex items-center gap-2">
          <BookOpen size={24}/> Acervo Gerenciado
        </h3>

        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-slate-400" />
          </div>
          <input
            className="input-field p-3 !pl-11 w-full box-border"
            aria-label="Campo de texto para pesquisar no acervo por ID, título, autor ou situação"
            title="Barra de busca de livros"
            placeholder="Pesquisar por ID, título, autor..."
            onChange={e => setPesquisa(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-btnText">
                <th className="p-4 text-left font-bold">ID</th>
                <th className="p-4 text-left font-bold">Título</th>
                <th className="p-4 text-left font-bold">Autor</th>
                <th className="p-4 text-left font-bold">Categoria</th>
                <th className="p-4 text-left font-bold">Situação</th>
                <th className="p-4 text-left font-bold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.filter(l => {
                const removeAcentos = (str) => String(str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const termo = removeAcentos(pesquisa).trim();

                if (!termo) return true;
                const idMatch = String(l.id).includes(termo);
                const tituloMatch = removeAcentos(l.titulo).includes(termo);
                const autorMatch = removeAcentos(l.autores?.[0]?.nome).includes(termo);
                const catMatch = removeAcentos(l.categoria?.nome).includes(termo);
                const sitLimpa = removeAcentos(l.situacao);
                let sitMatch = sitLimpa.includes(termo);
                if (termo === "disponivel" && sitLimpa === "nao disponivel") sitMatch = false;

                return idMatch || tituloMatch || autorMatch || catMatch || sitMatch;
              }).map(l => (
                <BookRow key={l.id} livro={l} onEdit={prepararEdicaoLivro} onDelete={excluirLivro} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      <ChatIA plano={planoAtual} onPlanos={onPlanos} />
    </main>
  );
};

export default Dashboard;