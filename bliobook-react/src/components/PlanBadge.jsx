/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { Crown, Rocket } from 'lucide-react';

// Badge indicador de plano com renderização condicional de cores e bordas
export default function PlanBadge({ isPremium, planoAtual, highContrast, onPlanos }) {
  
  // Lógica de cores extraída para legibilidade:
  // Se for premium: usa a cor primária do tema.
  // Se não for: no modo alto contraste usa fundo do cartão, senão usa cinza padrão.
  const badgeColors = isPremium 
    ? 'bg-primary text-btnText border-transparent' 
    : (highContrast ? 'bg-cardBg text-textColor border-2 border-primary' : 'bg-slate-200 text-slate-600 border-transparent');

  return (
    <button
      type="button" 
      onClick={onPlanos}
      aria-label="Botão para visualização de planos"
      title="Ver Planos de Assinatura"
      // Posicionado no canto superior esquerdo, com efeito de hover e transição suave
      className={`absolute top-5 left-6 cursor-pointer rounded-full font-bold text-sm flex items-center gap-2 z-[9999] transition-transform duration-200 px-4 py-2 hover:scale-105 ${badgeColors}`}
    >
      {isPremium ? (
        // Ícone de coroa para planos pagos
        <><Crown size={16}/> Plano {planoAtual} Ativo</>
      ) : (
        // Ícone de foguete para incentivar upgrade no plano free
        <><Rocket size={16}/> Plano Free - Upgrade!</>
      )}
    </button>
  );
}