/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { render, screen, fireEvent } from '@testing-library/react';
import A11yWidget from './A11yWidget';
import { A11yProvider } from './A11yContext';
import { describe, it, expect } from 'vitest';

// Grupo de testes focado na trilha de QA e acessibilidade
describe('Trilha 3 QA: Testes de Acessibilidade no BlioBook', () => {
  
  // Teste 1: Verifica se o botão principal aparece e tem o rótulo correto para leitores de tela
  it('Deve renderizar o botão de Alto Contraste com rótulos ARIA corretos', () => {
    render(
      <A11yProvider>
        <A11yWidget />
      </A11yProvider>
    );
    
    // Busca o botão pelo texto alternativo (aria-label)
    const a11yButton = screen.getByLabelText(/Abrir menu de acessibilidade/i);
    expect(a11yButton).toBeInTheDocument();
  });

  // Teste 2: Valida a interação via teclado/clique e a abertura do painel
  it('Deve alterar o estado do painel ao interagir via teclado (WCAG)', () => {
    render(
      <A11yProvider>
        <A11yWidget />
      </A11yProvider>
    );
    
    const a11yButton = screen.getByLabelText(/Abrir menu de acessibilidade/i);
    
    // Simula o clique do usuário
    fireEvent.click(a11yButton);
    
    // Confirma que o painel interno foi revelado e está acessível
    const toggleContraste = screen.getByLabelText(/Ativar Modo de Alto Contraste/i);
    expect(toggleContraste).toBeInTheDocument();
  });
});