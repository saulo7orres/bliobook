/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

export class DashboardPage {
  constructor(page) {
    this.page = page;
    // Localizadores estáticos: Os campos do formulário de cadastro
    // Usamos data-testid para garantir estabilidade mesmo se o HTML mudar
    this.inputTitulo = page.getByTestId('input-titulo');
    this.inputAutor = page.getByTestId('input-autor');
    this.inputCategoria = page.getByTestId('input-categoria'); // Novo alvo mapeado
    this.btnSalvar = page.getByTestId('btn-salvar-livro');
  }

  // Ação: Preenche o formulário completo e submete
  async cadastrarLivro(titulo, autor, categoria) {
    await this.inputTitulo.fill(titulo);
    await this.inputAutor.fill(autor);
    await this.inputCategoria.fill(categoria); // Execução do preenchimento da categoria
    await this.btnSalvar.click();
  }

  // Ação: Encontra a linha exata da tabela e clica no botão de deletar
  async deletarLivro(titulo) {
    // Usa locator com :has-text para encontrar a linha específica contendo o título
    const linhaDoLivro = this.page.locator(`[data-testid="item-livro"]:has-text("${titulo}")`);
    // Clica no botão de deletar dentro dessa linha específica
    await linhaDoLivro.getByTestId('btn-deletar').click();
  }
}