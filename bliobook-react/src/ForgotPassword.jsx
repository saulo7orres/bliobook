/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState } from 'react';

const ForgotPassword = ({ onVoltar }) => {
  // Estado para armazenar o prefixo do email (antes do @bliobook.com)
  const [emailPrefix, setEmailPrefix] = useState('');

  // Gera senha aleatória com requisitos de segurança (maiúscula, minúscula, número, especial)
  const gerarSenhaSegura = () => {
    const maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minusculas = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const especiais = "!@#$%&*";
    const todos = maiusculas + minusculas + numeros + especiais;

    let senhaArray = [];
    const pegarAleatorio = (string) => string[Math.floor(Math.random() * string.length)];

    // Garante pelo menos um caractere de cada tipo
    senhaArray.push(pegarAleatorio(maiusculas));
    senhaArray.push(pegarAleatorio(minusculas));
    senhaArray.push(pegarAleatorio(numeros));
    senhaArray.push(pegarAleatorio(especiais));

    // Completa até 8 caracteres com caracteres aleatórios únicos
    while (senhaArray.length < 8) {
      let char = pegarAleatorio(todos);
      if (!senhaArray.includes(char)) senhaArray.push(char);
    }
    // Embaralha e retorna como string
    return senhaArray.sort(() => 0.5 - Math.random()).join('');
  };

  const handleRecuperar = (e) => {
    e.preventDefault();
    const emailCompleto = `${emailPrefix.trim()}@bliobook.com`.toLowerCase();
    
    // Carrega lista de usuários do localStorage
    let usuarios = JSON.parse(localStorage.getItem('bliobook_usuarios'));
    if (!usuarios || usuarios.length === 0) {
      usuarios = [];
    }

    // Busca índice do usuário com email correspondente
    const indexUsuario = usuarios.findIndex(u => u.email === emailCompleto);

    if (indexUsuario !== -1) {
      // Usuário encontrado: gera nova senha e atualiza registro
      const novaSenha = gerarSenhaSegura();
      usuarios[indexUsuario].senha = novaSenha;
      localStorage.setItem('bliobook_usuarios', JSON.stringify(usuarios));
      // Marca que há senha temporária pendente
      localStorage.setItem('bliobook_senha_temporaria', 'sim');
      
      // Tenta copiar senha para área de transferência
      navigator.clipboard.writeText(novaSenha).then(() => {
        alert(`[AMBIENTE DE SIMULAÇÃO: CAIXA DE E-MAIL]\n\nSua identidade foi confirmada!\n\nUma senha temporária foi gerada e COPIADA automaticamente para a sua área de transferência:\n\n${novaSenha}\n\nCole a senha na tela de login. O sistema exigirá que você crie uma nova senha permanente no primeiro acesso.`);
        onVoltar();
      }).catch(() => {
        // Falha na cópia: mostra senha manualmente
        alert(`[AMBIENTE DE SIMULAÇÃO: CAIXA DE E-MAIL]\n\nSua identidade foi confirmada!\n\nUma senha temporária foi gerada:\n\n${novaSenha}\n\nCopie esta senha. O sistema exigirá que você crie uma nova senha permanente no seu primeiro acesso.`);
        onVoltar();
      });
    } else {
      // Usuário não encontrado
      alert("E-mail não localizado na base de dados corporativa.");
    }
  };

  return (
    <main className="container mx-auto" style={{maxWidth: '450px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh'}}>
      <section className="card-gestalt" aria-labelledby="recuperacao-header" style={{padding: '30px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
        <header style={{textAlign: 'center', marginBottom: '20px'}}>
          <h1 id="recuperacao-header" style={{color: 'var(--primary-color)', fontSize: '2.5rem', margin: '0 0 5px 0'}}>BlioBook</h1>
          <p style={{color: 'var(--text-color)', fontWeight: 'bold', fontSize: '1.1rem', margin: 0}}>Recuperação de Senha</p>
        </header>

        <form onSubmit={handleRecuperar}>
          <div style={{marginBottom: '15px'}}>
            <label htmlFor="email-prefix" style={{fontWeight: 'bold', display: 'block', marginBottom: '8px', color: 'var(--text-color)'}}>E-mail Institucional: *</label>
            <div style={{display: 'flex'}}>
              <input 
                id="email-prefix" type="text" className="input-field" placeholder="usuario" 
                value={emailPrefix} onChange={(e) => setEmailPrefix(e.target.value)} required
                style={{ margin: 0, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, padding: '12px' }}
              />
              <span aria-hidden="true" style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '2px solid var(--input-border)', borderLeft: 'none', padding: '0 15px', fontSize: '1rem', fontWeight: 'bold', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', alignItems: 'center' }}>
                @bliobook.com
              </span>
            </div>
          </div>
          
          <button type="submit" className="btn-salvar" style={{width: '100%', marginTop: '30px', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', background: 'var(--primary-color)', color: 'var(--btn-text-color)', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
            SOLICITAR REDEFINIÇÃO
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '25px'}}>
          <button onClick={onVoltar} style={{background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', fontSize: '1rem'}}>
            Voltar para o Login
          </button>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;