/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

const A11yContext = createContext();

export const A11yProvider = ({ children }) => {
  // Lê as preferências salvas logo na inicialização (evita flash de tema padrão)
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('a11y-contrast') === 'true');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('a11y-fontsize')) || 14);

  // Alterna o alto contraste e já persiste a escolha no localStorage
  const toggleHighContrast = () => {
    setHighContrast(prev => {
      localStorage.setItem('a11y-contrast', String(!prev));
      return !prev;
    });
  };

  // Aumenta a fonte em 2px, com teto de 24px pra não quebrar o layout
  const increaseFontSize = () => {
    setFontSize(prev => {
      const newSize = Math.min(prev + 2, 24);
      localStorage.setItem('a11y-fontsize', String(newSize));
      return newSize;
    });
  };

  // Diminui a fonte em 2px, com piso de 12px pra manter legibilidade mínima
  const decreaseFontSize = () => {
    setFontSize(prev => {
      const newSize = Math.max(prev - 2, 12);
      localStorage.setItem('a11y-fontsize', String(newSize));
      return newSize;
    });
  };

  return (
    <A11yContext.Provider value={{ highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </A11yContext.Provider>
  );
};

// Hook customizado — facilita o import nos componentes consumidores
export const useA11y = () => useContext(A11yContext);