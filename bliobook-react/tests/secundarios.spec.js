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

test.describe('Validações de Borda e Segurança do Ecossistema', () => {

  // Teste 4: Regra de negócio - Login bloqueado
  test('deve bloquear o acesso com credenciais incorretas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Interceptador: Aceita o alerta nativo de "Credenciais inválidas"
    page.on('dialog', dialog => dialog.accept());
    
    await loginPage.navigate();
    // Tenta logar com dados que não existem no localStorage
    await loginPage.login('hacker', 'senhaFalsa123');
    
    // Asserção: Confirma que o sistema barrou a entrada e manteve o usuário na tela de login
    await expect(page.getByText('Acesso ao Ecossistema Digital')).toBeVisible();
  });

  // Teste 5: Interface - Elemento de recuperação de senha
  test('deve exibir a opção de recuperação de senha', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    // Verifica se o link de ajuda está presente na UI
    await expect(page.getByText('Esqueceu sua senha?')).toBeVisible();
  });

  // Teste 6: Interface - Elemento de criação de conta
  test('deve exibir a opção de cadastro de novos usuários', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    // Garante que o fluxo de novo usuário está acessível
    await expect(page.getByText('Cadastre-se')).toBeVisible();
  });

  // Teste 7: Regra de negócio - Proteção contra submissão vazia
  test('deve bloquear o cadastro de livro sem dados preenchidos', async ({ page }) => {
    // Injeção de sessão para pular o login e ir direto ao dashboard
    await page.addInitScript(() => {
      window.localStorage.setItem('bliobook_usuarios', JSON.stringify([{ nome: 'Saulo Torres', email: 'saulo@bliobook.com', senha: 'Qw!12345' }]));
    });
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('saulo', 'Qw!12345');

    const dashboardPage = new DashboardPage(page);
    
    // Interceptador: Aceita o alerta de validação ("Preencha o título...")
    page.on('dialog', dialog => dialog.accept());
    
    // Clica em salvar com tudo em branco para testar a validação
    await dashboardPage.btnSalvar.click();
    
    // Asserção: Confirma que o formulário continua visível, indicando que a ação foi bloqueada
    await expect(page.getByText('Novo Cadastro Transacional')).toBeVisible();
  });

  // Teste 8: Regra de negócio - Aborto de exclusão
  test('deve cancelar a exclusão de um livro se o usuário não confirmar', async ({ page }) => {
    // Prepara ambiente com usuário e livro específicos para este cenário
    await page.addInitScript(() => {
      window.localStorage.setItem('bliobook_usuarios', JSON.stringify([{ nome: 'Saulo', email: 's@bliobook.com', senha: '123' }]));
      window.localStorage.setItem('bliobook_livros', JSON.stringify([{ id: 777, titulo: 'O Hobbit', autor: 'Tolkien' }]));
    });
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('s', '123');

    const dashboardPage = new DashboardPage(page);
    await expect(page.getByText('O Hobbit')).toBeVisible();
    
    // INTERCEPTADOR REVERSO: Aqui o robô clica em "Cancelar" no pop-up, em vez de "OK"
    page.on('dialog', dialog => dialog.dismiss());
    await dashboardPage.deletarLivro('O Hobbit');
    
    // Asserção: O livro não foi apagado pois a ação foi cancelada pelo usuário
    await expect(page.getByText('O Hobbit')).toBeVisible();
  });

  // Teste 9: Interface - Limpeza de formulário
  test('deve limpar os campos do formulário ao clicar em Limpar', async ({ page }) => {
    // Setup básico de login
    await page.addInitScript(() => {
      window.localStorage.setItem('bliobook_usuarios', JSON.stringify([{ nome: 'Saulo', email: 's@bliobook.com', senha: '123' }]));
    });
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('s', '123');

    const dashboardPage = new DashboardPage(page);
    // Preenche um dado aleatório para ter algo para limpar
    await dashboardPage.inputTitulo.fill('Rascunho Aleatório');
    
    // Clica no botão Limpar da interface (identificado por nome acessível)
    await page.getByRole('button', { name: 'Botão para limpar todos os campos do formulário' }).click();
    
    // Asserção: Verifica se o campo foi esvaziado corretamente
    await expect(dashboardPage.inputTitulo).toHaveValue('');
  });

  // Teste 10: Filtro de Busca
  test('deve operar a barra de pesquisa dinamicamente', async ({ page }) => {
    // Setup com livro específico para filtrar
    await page.addInitScript(() => {
      window.localStorage.setItem('bliobook_usuarios', JSON.stringify([{ nome: 'Saulo', email: 's@bliobook.com', senha: '123' }]));
      window.localStorage.setItem('bliobook_livros', JSON.stringify([{ id: 101, titulo: 'Livro Secreto', autor: 'Autor Desconhecido' }]));
    });
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('s', '123');

    // Localiza e preenche a barra de busca pelo placeholder
    const searchBar = page.getByPlaceholder('Pesquisar por ID, título, autor...');
    await searchBar.fill('Secreto');

    // Asserção: O livro correspondente deve continuar visível após o filtro
    await expect(page.getByText('Livro Secreto')).toBeVisible();
  });
});