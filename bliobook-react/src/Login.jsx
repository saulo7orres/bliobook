/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ onEntrar, onEsqueci, onCriarConta }) => {
  // Estado para controlar prefixo do email (antes do @bliobook.com)
  const [emailPrefix, setEmailPrefix] = useState('');
  // Estado para senha e visibilidade
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Função de login: valida credenciais contra localStorage
  const handleEntrar = (e) => {
    e.preventDefault();
    // Monta email completo e normaliza (minusculas, sem espaços)
    const emailCompleto = `${emailPrefix.trim()}@bliobook.com`.toLowerCase();
    const senhaLimpa = senha.trim();
    
    // Recupera lista de usuários do localStorage
    let usuarios = JSON.parse(localStorage.getItem('bliobook_usuarios'));
    if (!usuarios || usuarios.length === 0) {
      usuarios = [];
      localStorage.setItem('bliobook_usuarios', JSON.stringify(usuarios));
    }

    // Busca usuário com email e senha correspondentes
    const usuarioValido = usuarios.find(u => u.email === emailCompleto && u.senha.trim() === senhaLimpa);

    if (usuarioValido) {
      // Salva dados de sessão no localStorage
      localStorage.setItem('bliobook_user_nome', usuarioValido.nome);
      localStorage.setItem('bliobook_user_email', usuarioValido.email);
      localStorage.setItem('bliobook_user_senha', usuarioValido.senha);
      // Dispara evento de login bem-sucedido
      onEntrar();
    } else {
      // Alerta genérico para evitar enumeração de usuários
      alert("Credenciais inválidas. Verifique seu login e senha. Certifique-se de não colar espaços em branco.");
    }
  };

  return (
    <main className="container mx-auto" style={{maxWidth: '450px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh'}}>
      <section className="card-gestalt" aria-labelledby="login-titulo" style={{padding: '30px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
        <header style={{textAlign: 'center', marginBottom: '25px'}}>
          <h1 id="login-titulo" style={{color: 'var(--primary-color)', margin: '0 0 10px 0', fontSize: '2rem'}}>BlioBook</h1>
          <p style={{color: 'var(--text-color)', margin: 0}}>Acesso ao Ecossistema Digital</p>
        </header>

        <form onSubmit={handleEntrar} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {/* Campo de email institucional */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="email-acesso" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Usuário Institucional</label>
            <div style={{display: 'flex', alignItems: 'stretch'}}>
              <input 
                id="email-acesso" type="text" className="input-field" placeholder="usuario" 
                value={emailPrefix} onChange={(e) => setEmailPrefix(e.target.value)} required
                data-testid="input-email" /* Alvo de automacao: Campo de Email */
                style={{ margin: 0, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, padding: '12px' }}
              />
              <span aria-hidden="true" style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '2px solid var(--input-border)', borderLeft: 'none', padding: '0 15px', fontSize: '1rem', fontWeight: 'bold', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', alignItems: 'center' }}>
                @bliobook.com
              </span>
            </div>
          </div>

          {/* Campo de senha com toggle de visibilidade */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="senha-acesso" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Senha de Acesso</label>
            <div style={{position: 'relative'}}>
              <input 
                id="senha-acesso" type={mostrarSenha ? "text" : "password"} className="input-field" placeholder="Sua senha..." 
                value={senha} onChange={(e) => setSenha(e.target.value)} required
                data-testid="input-password" /* Alvo de automacao: Campo de Senha */
                style={{ margin: 0, width: '100%', boxSizing: 'border-box', padding: '12px', paddingRight: '45px' }}
              />
              {/* Botão para mostrar/ocultar senha */}
              <button 
                type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {mostrarSenha ? (
                  <EyeOff size={20} style={{ color: 'inherit' }} />
                ) : (
                  <Eye size={20} style={{ color: 'inherit' }} />
                )}
              </button>
            </div>
          </div>
          
          {/* Botão de acesso */}
          <button 
            type="submit" 
            className="btn-salvar"
            data-testid="btn-login" /* Alvo de automacao: Botao de Submissao */
            style={{width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', background: 'var(--primary-color)', color: 'var(--btn-text-color)', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
          >
            ACESSAR ACERVO
          </button>
        </form>
        
        {/* Links para recuperação e cadastro */}
        <div style={{textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <button onClick={onEsqueci} style={{background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', fontSize: '0.95rem'}}>
            Esqueceu sua senha?
          </button>
          <button onClick={onCriarConta} style={{background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem'}}>
            Não tem uma conta? <span style={{color: '#1d4ed8', textDecoration: 'underline'}}>Cadastre-se</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Login;