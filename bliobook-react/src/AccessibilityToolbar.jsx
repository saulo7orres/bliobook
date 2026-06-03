/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useA11y } from './A11yContext';

const AccessibilityToolbar = () => {
  // Pega as funções e estado do contexto de acessibilidade
  const { toggleContrast, changeFontSize, highContrast } = useA11y();

  return (
    <nav className="a11y-toolbar" aria-label="Barra de ferramentas de acessibilidade">
      <div className="a11y-container">
        <span className="a11y-title">Acessibilidade:</span>
        {/* Alterna entre tema normal e alto contraste */}
        <button 
          className={`a11y-btn ${highContrast ? 'active' : ''}`} 
          onClick={toggleContrast} 
          aria-pressed={highContrast}
          aria-label="Alternar modo de alto contraste"
        >
          🌓 Alto Contraste
        </button>
        {/* Aumenta a fonte multiplicando por 1.1 */}
        <button className="a11y-btn" onClick={() => changeFontSize(1.1)} aria-label="Aumentar tamanho do texto">
          A+ Letra Grande
        </button>
        {/* Restaura a fonte pro tamanho original (multiplicador 1) */}
        <button className="a11y-btn" onClick={() => changeFontSize(1)} aria-label="Restaurar tamanho do texto original">
          A- Texto Normal
        </button>
      </div>
    </nav>
  );
};

export default AccessibilityToolbar;