/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

/* global process */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Pasta onde ficam todos os testes
  fullyParallel: true, // Roda testes em paralelo para ganhar velocidade
  forbidOnly: !!process.env.CI, // Impede testes marcados como '.only' no CI (evita erros silenciosos)
  retries: process.env.CI ? 2 : 0, // No CI, tenta rodar novamente em caso de falha; local não repete
  workers: process.env.CI ? 1 : undefined, // No CI, usa 1 worker para evitar sobrecarga; local usa o máximo disponível
  reporter: 'html', // Gera relatório visual no final da execução
  use: {
    trace: 'on-first-retry', // Grava traço apenas quando houver retry (economiza espaço)
    video: 'retain-on-failure', // Salva vídeo apenas se o teste falhar (útil para debug)
  },
  projects: [
    // Homologação no motor da Mozilla (Seu ambiente)
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }, // Testa especificamente no Firefox Desktop
    },
    // Homologação no motor da Google (Padrão de mercado)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Testa especificamente no Chromium/Chrome Desktop
    },
  ],
});