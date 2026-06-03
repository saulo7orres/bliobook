/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState, useEffect, useRef } from 'react';
import { User, LogOut } from 'lucide-react';

// Menu suspenso de perfil gerenciado por estado e clique externo
export default function ProfileDropdown({ inicialAvatar, onPerfil, onSair }) {
  // Controla se o dropdown está visível
  const [aberto, setAberto] = useState(false);
  // Referência para detectar cliques fora e fechar o menu automaticamente
  const menuRef = useRef(null);

  // Efeito para fechar o menu se clicar fora da área do dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAberto(false);
      }
    };
    // Adiciona o listener apenas se o menu estiver aberto
    if (aberto) document.addEventListener("mousedown", handleClickOutside);
    // Limpa o listener ao desmontar ou fechar o menu
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [aberto]);

  return (
    <div ref={menuRef} className="absolute top-4 right-6 z-10">
      {/* Botão circular com a inicial do nome do usuário */}
      <button
        className="bg-primary text-btnText border-none w-12 h-12 rounded-full font-bold text-[1.3rem] cursor-pointer flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
        onClick={() => setAberto(!aberto)}
        aria-label="Menu de opções do perfil do usuário"
      >
        {inicialAvatar}
      </button>
      
      {/* Renderiza o dropdown apenas se 'aberto' for true */}
      {aberto && (
        <div className="absolute right-0 top-14 bg-cardBg border-2 border-primary rounded-lg flex flex-col shadow-[0_10px_25px_rgba(0,0,0,0.3)] min-w-[160px] overflow-hidden">
          {/* Opção: Ir para configurações de perfil */}
          <button 
            className="px-4 py-3 border-none bg-transparent cursor-pointer text-textColor text-left font-bold text-base" 
            onClick={() => { setAberto(false); onPerfil(); }}
          >
            <User size={16} className="inline mr-2 align-middle"/> Meu Perfil
          </button>
          {/* Opção: Sair do sistema (destaque em vermelho) */}
          <button 
            className="px-4 py-3 border-none border-t border-inputBorder bg-transparent cursor-pointer text-red-600 text-left font-bold text-base" 
            onClick={onSair}
          >
            <LogOut size={16} className="inline mr-2 align-middle"/> Sair do Sistema
          </button>
        </div>
      )}
    </div>
  );
}