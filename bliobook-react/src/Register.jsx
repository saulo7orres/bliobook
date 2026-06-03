/*
Faculdade: Faculdade Alpha
Curso: Análise e Desenvolvimento de Sistemas
Aluno: Saulo Torres de Oliveira Assis
Professora: Tarciana Maria de Sena Katter
Projeto: BlioBook - Ecossistema Digital para Gestão Dinâmica de Conhecimento
*/

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Register = ({ onCadastrado, onVoltar }) => {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  // Toggle para mostrar/ocultar senhas
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Validações de segurança da senha (feedback visual em tempo real)
  const reqLength = senha.length >= 8;
  const reqUpper = /[A-Z]/.test(senha);
  const reqLower = /[a-z]/.test(senha);
  const reqNumber = /\d/.test(senha);
  const reqSpecial = /[@$!%*?&]/.test(senha);
  const reqNoRepeat = senha.length >= 2 && new Set(senha).size === senha.length;
  
  // Senha só é válida se atender TODOS os requisitos
  const senhaValida = reqLength && reqUpper && reqLower && reqNumber && reqSpecial && reqNoRepeat;
  // Formulário só habilita se senha válida E todos campos preenchidos
  const formValido = senhaValida && nome.trim() !== '' && emailPrefix.trim() !== '' && confirmarSenha.trim() !== '';

  const handleCadastro = (e) => {
    e.preventDefault();
    
    // Validação básica: campos não podem estar vazios
    if (!nome.trim() || !emailPrefix.trim() || !senha.trim() || !confirmarSenha.trim()) {
      return alert("Ação Bloqueada: Todos os campos são obrigatórios e não podem conter apenas espaços em branco.");
    }
    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      return alert("As senhas não coincidem. Verifique a digitação.");
    }

    // Monta email completo com domínio fixo
    const emailCompleto = `${emailPrefix.trim()}@bliobook.com`.toLowerCase();
    
    // Carrega usuários existentes do localStorage
    let usuarios = JSON.parse(localStorage.getItem('bliobook_usuarios'));
    if (!usuarios || usuarios.length === 0) {
      usuarios = [];
    }

    // Limite de 15 usuários para simular infraestrutura local
    if (usuarios.length >= 15) {
      return alert("Ação Bloqueada: A infraestrutura local atingiu o limite de 15 usuários ativos.");
    }

    // Verifica se email já existe (evita duplicatas)
    const emailExistente = usuarios.some(u => u.email === emailCompleto);
    if (emailExistente) {
      return alert("Ação Bloqueada: Este e-mail já possui um registro ativo no ecossistema.");
    }

    // Cria novo usuário e salva no localStorage
    usuarios.push({ nome: nome.trim(), email: emailCompleto, senha });
    localStorage.setItem('bliobook_usuarios', JSON.stringify(usuarios));
    
    alert("Usuário cadastrado com sucesso na matriz local. Redirecionando para o login.");
    onCadastrado();
  };

  return (
    <main className="container mx-auto" style={{maxWidth: '450px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh'}}>
      <section className="card-gestalt" aria-labelledby="register-titulo" style={{padding: '30px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
        <header style={{textAlign: 'center', marginBottom: '25px'}}>
          <h1 id="register-titulo" style={{color: 'var(--primary-color)', margin: '0 0 10px 0', fontSize: '2rem'}}>Criar Conta</h1>
          <p style={{color: 'var(--text-color)', margin: 0}}>Junte-se ao ecossistema BlioBook</p>
        </header>

        <form onSubmit={handleCadastro} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          {/* Campo Nome Completo */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="nome-registro" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Nome Completo</label>
            <input 
              id="nome-registro" type="text" className="input-field" placeholder="Seu nome..." 
              value={nome} onChange={(e) => setNome(e.target.value)} required
              style={{ margin: 0, padding: '12px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Campo Email com domínio fixo */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="email-registro" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>E-mail Institucional</label>
            <div style={{display: 'flex', alignItems: 'stretch'}}>
              <input 
                id="email-registro" type="text" className="input-field" placeholder="usuario" 
                value={emailPrefix} onChange={(e) => setEmailPrefix(e.target.value)} required
                style={{ margin: 0, borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1, padding: '12px' }}
              />
              {/* Sufixo fixo do domínio */}
              <span aria-hidden="true" style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '2px solid var(--input-border)', borderLeft: 'none', padding: '0 15px', fontSize: '1rem', fontWeight: 'bold', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', alignItems: 'center' }}>
                @bliobook.com
              </span>
            </div>
          </div>

          {/* Campo Senha com toggle de visibilidade */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="senha-registro" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Senha Segura</label>
            <div style={{position: 'relative'}}>
              <input 
                id="senha-registro" type={mostrarSenha ? "text" : "password"} className="input-field" placeholder="Sua senha..." 
                value={senha} onChange={(e) => setSenha(e.target.value)} required
                style={{ margin: 0, width: '100%', boxSizing: 'border-box', padding: '12px', paddingRight: '45px' }}
              />
              {/* Botão para mostrar/ocultar senha */}
              <button 
                type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Lista de requisitos de senha com feedback visual (verde = atendido, cinza = pendente) */}
            <div style={{ marginTop: '12px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-color)' }}>
                <span style={{ color: reqLength ? '#16a34a' : '#64748b', fontWeight: reqLength ? 'bold' : 'normal' }}>{reqLength ? '✓' : '○'} Mínimo 8 caracteres</span>
                <span style={{ color: reqUpper ? '#16a34a' : '#64748b', fontWeight: reqUpper ? 'bold' : 'normal' }}>{reqUpper ? '✓' : '○'} Uma letra maiúscula</span>
                <span style={{ color: reqLower ? '#16a34a' : '#64748b', fontWeight: reqLower ? 'bold' : 'normal' }}>{reqLower ? '✓' : '○'} Uma letra minúscula</span>
                <span style={{ color: reqNumber ? '#16a34a' : '#64748b', fontWeight: reqNumber ? 'bold' : 'normal' }}>{reqNumber ? '✓' : '○'} Um número</span>
                <span style={{ color: reqSpecial ? '#16a34a' : '#64748b', fontWeight: reqSpecial ? 'bold' : 'normal' }}>{reqSpecial ? '✓' : '○'} Um caractere especial (@$!%*?&)</span>
                <span style={{ color: reqNoRepeat ? '#16a34a' : '#64748b', fontWeight: reqNoRepeat ? 'bold' : 'normal' }}>{reqNoRepeat ? '✓' : '○'} Sem caracteres repetidos</span>
            </div>
          </div>

          {/* Campo Confirmar Senha com toggle de visibilidade */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="confirma-senha" style={{fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-color)'}}>Confirmar Senha</label>
            <div style={{position: 'relative'}}>
              <input 
                id="confirma-senha" type={mostrarConfirmarSenha ? "text" : "password"} className="input-field" placeholder="Repita sua senha..." 
                value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required
                style={{ margin: 0, padding: '12px', width: '100%', boxSizing: 'border-box', paddingRight: '45px' }}
              />
              <button 
                type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          {/* Botão de submit desabilitado se formulário inválido */}
          <button 
            type="submit" disabled={!formValido} className="btn-salvar" 
            style={{ width: '100%', marginTop: '10px', padding: '15px', fontSize: '1.1rem', fontWeight: 'bold', background: formValido ? 'var(--primary-color)' : '#94a3b8', color: 'var(--btn-text-color)', border: 'none', borderRadius: '8px', cursor: formValido ? 'pointer' : 'not-allowed', transition: 'background-color 0.3s' }}
          >
            FINALIZAR CADASTRO
          </button>
        </form>
        
        {/* Link para voltar ao login */}
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button onClick={onVoltar} style={{background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', fontSize: '0.95rem'}}>
            Já possui conta? Voltar ao Login
          </button>
        </div>
      </section>
    </main>
  );
};

export default Register;