/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Operações de CRUD no Acervo BlioBook', () => {
  
  // PREPARAÇÃO: Isolamento absoluto de dados antes de cada teste
  test.beforeEach(async ({ page }) => {
    // Injeção de estado no LocalStorage: Simula banco de dados inicial limpo
    await page.addInitScript(() => {
      window.localStorage.setItem('bliobook_usuarios', JSON.stringify([
        { nome: 'Saulo Torres', email: 'saulo@bliobook.com', senha: 'Qw!12345' }
      ]));
      window.localStorage.setItem('bliobook_livros', JSON.stringify([
        { id: 999, titulo: 'Arquitetura Limpa', autor: 'Robert C. Martin' }
      ]));
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    // Autentica com o usuário injetado acima
    await loginPage.login('saulo', 'Qw!12345');
    
    // Confirma que o login funcionou verificando um elemento do dashboard
    await expect(page.getByText('Novo Cadastro Transacional', { exact: false })).toBeVisible();
  });

  // TESTE 1: Validando a criação (Create)
  test('deve cadastrar um novo livro no ecossistema com sucesso', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Interceptador: Desarma qualquer pop-up preventivamente para não travar o teste
    page.on('dialog', dialog => dialog.accept());

    // Executa a ação preenchendo Título, Autor e a obrigatória Categoria
    await dashboardPage.cadastrarLivro('O Mítico Homem-Mês', 'Fred Brooks', 'Engenharia de Software');
    
    // Asserção: Confirma que o novo livro apareceu na lista
    await expect(page.getByText('O Mítico Homem-Mês')).toBeVisible();
  });

  // TESTE 2: Validando a exclusão (Delete)
  test('deve deletar um livro existente do acervo', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    
    // Garante que o livro pré-injetado está lá antes de tentar apagar
    await expect(page.getByText('Arquitetura Limpa')).toBeVisible();
    
    // Interceptador: Confirma a exclusão automaticamente no diálogo de alerta
    page.on('dialog', dialog => dialog.accept());
    
    // Chama o método da página para deletar pelo título
    await dashboardPage.deletarLivro('Arquitetura Limpa');
    
    // Verifica se o livro realmente sumiu da tela
    await expect(page.getByText('Arquitetura Limpa')).toBeHidden();
  });
});