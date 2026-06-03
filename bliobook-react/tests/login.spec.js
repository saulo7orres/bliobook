/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('deve realizar login com credenciais validas e carregar o painel', async ({ page }) => {
  // 1. O Suborno: Injetando um usuário no LocalStorage do robô ANTES de navegar
  // Isso garante que o backend "simulado" saiba quem é o usuário
  await page.addInitScript(() => {
    window.localStorage.setItem('bliobook_usuarios', JSON.stringify([
      { nome: 'Saulo Torres', email: 'saulo@bliobook.com', senha: 'Qw!12345' }
    ]));
  });

  const loginPage = new LoginPage(page);
  
  // 2. A Ação: Navega e tenta o acesso
  await loginPage.navigate();
  
  // Enviamos apenas o prefixo, respeitando a regra de negócio do seu componente
  await loginPage.login('saulo', 'Qw!12345');

  // 3. A Asserção de Estado: Em vez de buscar uma URL que não muda, 
  // exigimos que a interface do Painel apareça. 
  // Aqui estamos buscando um elemento de cabeçalho genérico ou 
  // algo que comprove a entrada. Se o seu Dashboard tiver um botão de "Sair", 
  // ele é a prova cabal de que o login funcionou.
  
  // Aguarda a aparição do título do formulário principal, comprovando o acesso
  await expect(page.getByText('Novo Cadastro Transacional', { exact: false })).toBeVisible();
});