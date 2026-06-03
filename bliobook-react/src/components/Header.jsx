/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

// Componente isolado do Dashboard — só renderiza o título e subtítulo do projeto
export default function Header() {
  return (
    <header className="mb-[35px] text-center">
      {/* Título principal usa variável CSS --primary-color (definida no App.css) */}
      <h1 className="text-primary m-0 text-[2.5rem]">BlioBook</h1>
      {/* Subtítulo do projeto — usa Tailwind para tipografia */}
      <p className="text-white font-bold text-[1.1rem] mt-2">
        Ecossistema Digital para Gestão Dinâmica de Conhecimento
      </p>
    </header>
  );
}