/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

export class LoginPage {
  constructor(page) {
    this.page = page;
    // Mapeamento dos inputs e botão usando test-ids para robustez
    this.emailInput = page.getByTestId('input-email');
    this.passwordInput = page.getByTestId('input-password');
    this.loginButton = page.getByTestId('btn-login');
  }

  // Navega para a URL base da aplicação
  async navigate() {
    await this.page.goto('http://localhost:5173/');
  }

  // Método auxiliar para realizar o login preenchendo e clicando
  async login(prefixo, password) {
    await this.emailInput.fill(prefixo);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}