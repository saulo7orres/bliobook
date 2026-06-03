/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { Pen, Trash2 } from 'lucide-react';

// Define a cor da fonte baseada na situação no acervo
const corSituacao = (situacao) => {
  if (situacao === "Disponível") return "text-green-600";
  if (situacao === "Emprestado") return "text-orange-500";
  return "text-red-600";
};

// Componente de linha da tabela de gerenciamento de livros
export default function BookRow({ livro, onEdit, onDelete }) {
  return (
    <tr className="border-b-2 border-inputBorder" data-testid="item-livro" /* Alvo de Automacao: A linha que envelopa os dados do livro */>
      <td className="p-4 text-textColor">{livro.id}</td>
      <td className="p-4 font-bold text-textColor">{livro.titulo}</td>
      <td className="p-4 text-textColor">{livro.autores?.[0]?.nome}</td>
      <td className="p-4 text-textColor">{livro.categoria?.nome}</td>
      <td className={`p-4 font-bold ${corSituacao(livro.situacao)}`}>{livro.situacao}</td>
      <td className="p-4">
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(livro)} 
            className="btn-cancelar px-3 py-2 rounded-lg font-bold cursor-pointer" 
            aria-label={`Carregar formulário para editar o livro ${livro.titulo}`}
          >
            <Pen size={16}/>
          </button>
          <button 
            onClick={() => onDelete(livro.id)} 
            className="btn-excluir px-3 py-2 rounded-lg font-bold cursor-pointer" 
            aria-label={`Remover definitivamente o livro ${livro.titulo} do acervo`}
            data-testid="btn-deletar" /* Alvo de Automacao: Botao Excluir deste livro especifico */
          >
            <Trash2 size={16}/>
          </button>
        </div>
      </td>
    </tr>
  );
}