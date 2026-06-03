/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { A11yProvider } from './A11yContext'

// Ponto de entrada da aplicação: monta o React no elemento DOM 'root'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode ajuda a identificar efeitos colaterais e problemas durante o desenvolvimento */}
    <A11yProvider>
      {/* Contexto global de acessibilidade disponível em toda a árvore de componentes */}
      <App />
    </A11yProvider>
  </StrictMode>,
)